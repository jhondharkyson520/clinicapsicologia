"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCaixaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const date_fns_1 = require("date-fns");
class ListCaixaService {
    async execute() {
        const caixa = await prisma_1.default.caixa.findMany({
            select: {
                id: true,
                dataOperacao: true,
                valorPlano: true,
                valorAberto: true,
                client: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                dataOperacao: 'desc'
            }
        });
        return caixa.map((caixa) => ({
            id: caixa.id,
            dataOperacao: (0, date_fns_1.format)(new Date(caixa.dataOperacao), 'dd/MM/yyyy'),
            valorPlano: caixa.valorPlano,
            valorAberto: caixa.valorAberto,
            client: {
                name: caixa.client.name,
            },
        }));
    }
}
exports.ListCaixaService = ListCaixaService;
