"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProximaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const luxon_1 = require("luxon");
class ListProximaService {
    async execute() {
        const dataAtual = luxon_1.DateTime.local().toISODate();
        try {
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
                            id: true,
                        },
                    },
                },
            });
            const agendaItems = agendas.map((agenda) => {
                try {
                    const dataFormatada = new Date(agenda.dataConsulta).toLocaleDateString('pt-BR');
                    const horaFormatada = new Date(agenda.horarioConsulta).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        timeZone: 'UTC',
                    });
                    return {
                        id: agenda.id,
                        name: agenda.client.name,
                        dataConsulta: dataFormatada,
                        horarioConsulta: horaFormatada,
                        sessoesContador: agenda.sessoesContador,
                        quantidadeSessoes: agenda.client.quantidadeSessoes,
                        client_id: agenda.client.id,
                    };
                }
                catch (error) {
                    console.error('Error processing agenda item:', error.message);
                    return null;
                }
            });
            console.log('Agenda Items:', agendaItems);
            const filteredAgendaItems = agendaItems.filter((agenda) => {
                if (!agenda) {
                    return false;
                }
                const dataConsultaFormatted = luxon_1.DateTime.fromFormat(agenda.dataConsulta, 'dd/MM/yyyy').toISODate();
                return dataConsultaFormatted === dataAtual;
            }).sort((a, b) => {
                return luxon_1.DateTime.fromFormat(a.horarioConsulta, 'HH:mm').toMillis() - luxon_1.DateTime.fromFormat(b.horarioConsulta, 'HH:mm').toMillis();
            });
            console.log('Filtered Agenda Items:', filteredAgendaItems);
            return filteredAgendaItems;
        }
        catch (error) {
            console.error('Error fetching agendas from Prisma:', error.message);
            return [];
        }
    }
}
exports.ListProximaService = ListProximaService;
