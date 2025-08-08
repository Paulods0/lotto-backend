"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
async function createUser({ user, ...data }) {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email: data.email } });
    if (existingUser)
        throw new errors_1.ConflictError('Já existe um usuário com este email.');
    const salt = bcrypt_1.default.genSaltSync(10);
    const hashedPassword = await bcrypt_1.default.hash(data.password, salt);
    await prisma_1.default.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                role: data.role,
                password: hashedPassword,
            },
        });
        const { id, created_at, password, ...rest } = newUser;
        await (0, audit_log_1.audit)(tx, 'create', {
            entity: 'user',
            user,
            before: null,
            after: newUser,
        });
    });
    await Promise.all([(0, delete_cache_1.deleteCache)(keys_1.RedisKeys.users.all()), (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
}
