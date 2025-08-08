"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = updateUser;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
async function updateUser({ user, ...data }) {
    const existingUser = await prisma_1.default.user.findUnique({ where: { id: data.id } });
    if (!existingUser)
        throw new errors_1.NotFoundError('Usuário não encontrado.');
    await prisma_1.default.$transaction(async (tx) => {
        const updatedUser = await prisma_1.default.user.update({
            where: { id: data.id },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role: data.role,
            },
        });
        await (0, audit_log_1.audit)(tx, 'update', {
            entity: 'user',
            user,
            before: existingUser,
            after: updatedUser,
        });
    });
    await (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.users.all());
}
