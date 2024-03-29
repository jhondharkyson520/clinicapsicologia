import { DateTime } from 'luxon';
import prismaClient from '../../prisma';


interface AgendaRequest {
  dataConsulta: string;
  horarioConsulta: string;
  client_id: string;
}

class CreateAgendaService {
  async execute({ dataConsulta, horarioConsulta, client_id }: AgendaRequest) {
    if (dataConsulta === '' || horarioConsulta === '' || client_id === '') {
      throw new Error('Preencha todos os campos!');
    }

    try {
      
      const dataHoraLuxon = DateTime.fromFormat(`${dataConsulta} ${horarioConsulta}`, 'dd/MM/yyyy HH:mm', { zone: 'UTC' });

      const horaAtual = DateTime.now();

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


      
      const agendamentoExistente = await prismaClient.agenda.findFirst({
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

      const client = await prismaClient.clients.findUnique({
        where: { id: client_id },
      });

      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      const novaSessaoContador = (client.sessoesContador || 0) + 1;

      

      const agenda = await prismaClient.agenda.create({
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
        await prismaClient.clients.update({
          where: { id: client_id },
          data: { situacao: false },
        });
      }

     
      await prismaClient.clients.update({
        where: { id: client_id },
        data: { sessoesContador: novaSessaoContador },
      });

      return agenda;
    } catch (error) {
      throw new Error(`Erro ao criar agenda: ${error.message}`);
    }
  }
}

export { CreateAgendaService };