"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteClientService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteClientService {
    async execute(clientId) {
        if (!clientId) {
            throw new Error("É necessário fornecer o ID do cliente para a exclusão.");
        }
        const existingClient = await prisma_1.default.clients.findUnique({
            where: { id: clientId },
        });
        if (!existingClient) {
            throw new Error(`Não foi possível encontrar um cliente com o ID ${clientId}.`);
        }
        await prisma_1.default.agenda.deleteMany({
            where: { client_id: clientId },
        });
        await prisma_1.default.caixa.deleteMany({
            where: { client_id: clientId },
        });
        const client = await prisma_1.default.clients.delete({
            where: { id: clientId },
        });
        return client;
    }
}
exports.DeleteClientService = DeleteClientService;
