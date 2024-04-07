"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const date_fns_1 = require("date-fns");
class UpdateClientService {
    async execute({ id, name, email, cpf, telefone, endereco, tipoPlano, planoFamiliar, dataVencimento, valorPlano, quantidadeSessoes, situacao, }) {
        if (!id) {
            throw new Error("É necessário fornecer o ID do cliente para a atualização.");
        }
        const parsedDataVencimento = dataVencimento
            ? (0, date_fns_1.parse)(dataVencimento, 'dd/MM/yyyy', new Date())
            : null;
        const client = await prisma_1.default.clients.update({
            where: { id },
            data: {
                name,
                email,
                cpf,
                telefone,
                endereco,
                tipoPlano,
                planoFamiliar,
                dataVencimento: parsedDataVencimento,
                valorPlano,
                quantidadeSessoes: quantidadeSessoes !== null ? quantidadeSessoes : undefined,
                situacao,
            },
        });
        return client;
    }
}
exports.UpdateClientService = UpdateClientService;
