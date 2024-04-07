"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAgendaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListAgendaService {
    async execute() {
        const agendas = await prisma_1.default.agenda.findMany({
            select: {
                id: true,
                dataConsulta: true,
                horarioConsulta: true,
                sessoesContador: true,
                client: {
                    select: {
                        name: true,
                        quantidadeSessoes: true,
                    },
                },
            },
        });
        return agendas.map((agenda) => {
            if (!agenda.dataConsulta || !agenda.horarioConsulta) {
                throw new Error('Invalid date or time value');
            }
            const dataFormatada = new Date(agenda.dataConsulta).toLocaleDateString('pt-BR');
            const horaFormatada = new Date(agenda.horarioConsulta).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC',
            });
            return {
                id: agenda.id,
                dataConsulta: dataFormatada,
                horarioConsulta: horaFormatada,
                sessoesContador: agenda.sessoesContador,
                client: {
                    name: agenda.client.name,
                    quantidadeSessoes: agenda.client.quantidadeSessoes,
                },
            };
        });
    }
}
exports.ListAgendaService = ListAgendaService;
