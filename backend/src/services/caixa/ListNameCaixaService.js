"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNameCaixaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListNameCaixaService {
    async execute({ caixa_id }) {
        const findByName = await prisma_1.default.caixa.findFirst({
            where: {
                client_id: caixa_id
            },
            orderBy: { dataOperacao: 'desc' },
        });
        return findByName;
    }
}
exports.ListNameCaixaService = ListNameCaixaService;
