"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAgendaService = void 0;
const luxon_1 = require("luxon");
const prisma_1 = __importDefault(require("../../prisma"));
class CreateAgendaService {
    async execute({ dataConsulta, horarioConsulta, client_id }) {
        if (dataConsulta === '' || horarioConsulta === '' || client_id === '') {
            throw new Error('Preencha todos os campos!');
        }
        try {
            const dataHoraLuxon = luxon_1.DateTime.fromFormat(`${dataConsulta} ${horarioConsulta}`, 'dd/MM/yyyy HH:mm', { zone: 'UTC' });
            const horaAtual = luxon_1.DateTime.now();
            console.log(dataHoraLuxon);
            console.log(horaAtual);
            if (dataHoraLuxon.toMillis() <= horaAtual.startOf('day').toMillis()) {
                console.log('Não é possível fazer agendamentos para datas passadas');
                return;
            }
            if (dataHoraLuxon.toISO() <= horaAtual.toISO()) {
                console.log('Não é possível fazer agendamentos para horários passados');
                return;
            }
            console.log('Agendamento possível');
            const agendamentoExistente = await prisma_1.default.agenda.findFirst({
                where: {
                    AND: [
                        { dataConsulta: dataHoraLuxon.toISO() },
                        { horarioConsulta: dataHoraLuxon.toISO() },
                    ],
                },
            });
            if (agendamentoExistente) {
                throw new Error('Já existe um agendamento para a mesma data e horário.');
            }
            const client = await prisma_1.default.clients.findUnique({
                where: { id: client_id },
            });
            if (!client) {
                throw new Error('Cliente não encontrado');
            }
            const novaSessaoContador = (client.sessoesContador || 0) + 1;
            const agenda = await prisma_1.default.agenda.create({
                data: {
                    dataConsulta: dataHoraLuxon.toISO(),
                    horarioConsulta: dataHoraLuxon.toISO(),
                    client: {
                        connect: {
                            id: client_id,
                        },
                    },
                    sessoesContador: novaSessaoContador,
                },
            });
            if (client.quantidadeSessoes !== null && novaSessaoContador === client.quantidadeSessoes) {
                await prisma_1.default.clients.update({
                    where: { id: client_id },
                    data: { situacao: false },
                });
            }
            await prisma_1.default.clients.update({
                where: { id: client_id },
                data: { sessoesContador: novaSessaoContador },
            });
            return agenda;
        }
        catch (error) {
            throw new Error(`Erro ao criar agenda: ${error.message}`);
        }
    }
}
exports.CreateAgendaService = CreateAgendaService;
