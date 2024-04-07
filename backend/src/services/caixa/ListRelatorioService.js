"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRelatorioService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListRelatorioService {
    async execute() {
        const caixa = await prisma_1.default.caixa.findMany({
            select: {
                id: true,
                dataOperacao: true,
                valorPlano: true,
                valorAberto: true,
                valorPago: true,
                client: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                dataOperacao: 'desc'
            }
        });
        return caixa;
    }
}
exports.ListRelatorioService = ListRelatorioService;
