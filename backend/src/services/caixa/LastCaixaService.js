"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastCaixaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class LastCaixaService {
    async execute(clientId) {
        try {
            const lastCaixa = await prisma_1.default.caixa.findFirst({
                where: { client_id: clientId },
                orderBy: { dataOperacao: 'desc' },
            });
            return lastCaixa;
        }
        catch (error) {
            throw new Error('Erro ao buscar a última caixa');
        }
    }
}
exports.LastCaixaService = LastCaixaService;
