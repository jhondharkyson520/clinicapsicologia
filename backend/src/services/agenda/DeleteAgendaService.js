"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteAgendaService {
    async execute(agendaId) {
        if (!agendaId) {
            throw new Error("É necessário fornecer o ID do agendamento para a exclusão.");
        }
        const existingAgenda = await prisma_1.default.agenda.findUnique({
            where: { id: agendaId },
        });
        if (!existingAgenda) {
            throw new Error(`Não foi possível encontrar um agendamento com o ID ${agendaId}.`);
        }
        const agenda = await prisma_1.default.agenda.delete({
            where: { id: agendaId },
        });
        console.log("Agendamento deletado com sucesso");
        return agenda;
    }
}
exports.DeleteAgendaService = DeleteAgendaService;
