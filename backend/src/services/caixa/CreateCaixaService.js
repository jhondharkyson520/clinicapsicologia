"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCaixaService = void 0;
const library_1 = require("@prisma/client/runtime/library");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateCaixaService {
    async execute({ client_id, valorPago }) {
        if (client_id === "" || valorPago === "") {
            throw new Error("Preencha todos os campos!");
        }
        const client = await prisma_1.default.clients.findUnique({
            where: { id: client_id },
        });
        if (!client) {
            throw new Error("Cliente não encontrado!");
        }
        const lastCaixa = await prisma_1.default.caixa.findFirst({
            where: { client_id: client_id },
            orderBy: { dataOperacao: 'desc' },
        });
        const valorPlano = client.valorPlano.toString();
        const valorAberto = library_1.Decimal.add(lastCaixa.valorAberto, valorPago).toString();
        const situacao = undefined;
        if (parseFloat(valorAberto) >= 0) {
            situacao === true;
        }
        else {
            situacao === false;
        }
        await prisma_1.default.clients.update({
            where: { id: client_id },
            data: {
                situacao: situacao
            },
        });
        const caixa = await prisma_1.default.caixa.create({
            data: {
                dataOperacao: new Date(),
                client_id: client_id,
                valorPlano: valorPlano,
                valorAberto: valorAberto,
                valorPago: valorPago
            },
        });
        if (client.sessoesContador >= client.quantidadeSessoes) {
            await prisma_1.default.clients.update({
                where: { id: client.id },
                data: {
                    sessoesContador: 0,
                    situacao: true
                }
            });
        }
        return caixa;
    }
}
exports.CreateCaixaService = CreateCaixaService;
