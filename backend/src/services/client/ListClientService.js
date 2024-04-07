"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListClientService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListClientService {
    async execute() {
        const clients = await prisma_1.default.clients.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                telefone: true,
                dataVencimento: true,
                tipoPlano: true,
                planoFamiliar: true,
                valorPlano: true,
                quantidadeSessoes: true,
                situacao: true,
                sessoesContador: true
            }
        });
        const caixa = await prisma_1.default.caixa.findMany();
        const today = new Date();
        const dayOfMonth = today.getDate();
        for (const client of clients) {
            const hasPayment = caixa.some(payment => payment.client_id === client.id);
            if (client.dataVencimento && !hasPayment) {
                const vencimento = new Date(client.dataVencimento);
                const vencimentoDoMes = vencimento.getDate();
                if (dayOfMonth === vencimentoDoMes) {
                    await prisma_1.default.clients.update({
                        where: { id: client.id },
                        data: { situacao: false }
                    });
                }
                else {
                    await prisma_1.default.clients.update({
                        where: { id: client.id },
                        data: { situacao: true }
                    });
                }
                const valorAberto = client.valorPlano;
                await prisma_1.default.caixa.create({
                    data: {
                        dataOperacao: new Date(),
                        client_id: client.id,
                        valorPlano: client.valorPlano,
                        valorAberto: -valorAberto,
                        valorPago: 0
                    },
                });
            }
            else if (client.sessoesContador >= client.quantidadeSessoes) {
                const valorAberto = client.valorPlano;
                await prisma_1.default.caixa.create({
                    data: {
                        dataOperacao: new Date(),
                        client_id: client.id,
                        valorPlano: client.valorPlano,
                        valorAberto: -valorAberto,
                        valorPago: 0
                    },
                });
                //console.log(`Cliente ${client.id} possui registro no caixa.`);
                continue;
            }
        }
        return clients;
    }
}
exports.ListClientService = ListClientService;
