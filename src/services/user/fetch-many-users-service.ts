import redis from "../../lib/redis";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { PaginationParams } from "../../@types/pagination-params";

export async function fetchManyUsersService({ limit = 30, page, query }: PaginationParams) {
    const exptime = 60 * 5

    const DEFAULT_LIMIT = limit ?? 30
    const DEFAULT_PAGE = page ?? 1
    const DEFAULT_QUERY = query?.trim() ?? "none"

    try {
        const cacheKey = `users:${DEFAULT_LIMIT}:page:${DEFAULT_PAGE}:query:${DEFAULT_QUERY}`;
        const cached = await redis.get(cacheKey)

        if (cached) return JSON.parse(cached)

        const orderBy: Prisma.UserOrderByWithRelationInput = { created_at: "asc" };
        let where: Prisma.UserWhereInput | undefined = undefined;

        if (query) {
            const searchConditions: Prisma.UserWhereInput[] = [];

            searchConditions.push({ first_name: { contains: query, mode: "insensitive" } });
            searchConditions.push({ last_name: { contains: query, mode: "insensitive" } });
            searchConditions.push({ email: { contains: query, mode: "insensitive" } });

            where = {
                AND: [
                    {
                        OR: searchConditions,
                    },
                    {
                        role: { in: ["area_manager", "dev", "super_admin", "supervisor"] },
                    }
                ]
            };
        }

        if (typeof page === "undefined") {
            const users = await prisma.user.findMany({ where, orderBy });
            await redis.set(cacheKey, JSON.stringify(users), "EX", exptime)
            return users
        }

        const offset = (DEFAULT_PAGE - 1) * limit;

        const users = await prisma.user.findMany({
            where,
            skip: offset,
            take: DEFAULT_LIMIT,
            orderBy,
        });

        if (users.length > 0) {
            await redis.set(cacheKey, JSON.stringify(users), "EX", exptime)
        }

        return users;

    } catch (error) {
        console.error("Error in fetchManyUsersService:", error);
        throw new AppError("Failed to fetch users", 500);
    }
}
