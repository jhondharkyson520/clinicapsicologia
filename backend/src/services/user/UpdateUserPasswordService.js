"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPasswordService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
class UpdateUserPasswordService {
    async execute({ userId, newPassword }) {
        const passwordHash = await (0, bcryptjs_1.hash)(newPassword, 8); // Hash da nova senha
        await prisma_1.default.user.update({
            where: {
                id: userId
            },
            data: {
                password: passwordHash
            }
        });
    }
}
exports.UpdateUserPasswordService = UpdateUserPasswordService;
