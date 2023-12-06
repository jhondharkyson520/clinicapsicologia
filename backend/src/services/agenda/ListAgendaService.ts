import prismaClient from '../../prisma';
import { format } from 'date-fns';

class ListAgendaService {
  async execute() {
    const agendas = await prismaClient.agenda.findMany({
      select: {
        id: true,
        dataConsulta: true,
        horarioConsulta: true,
        sessoesContador: true,
        client:{
          select:{
            name: true,
            quantidadeSessoes: true,
          }
        }
      },
    });

    return agendas.map((agenda) => ({
      id: agenda.id,
      dataConsulta: format(new Date(agenda.dataConsulta), 'dd/MM/yyyy'),
      horarioConsulta: format(new Date(agenda.horarioConsulta), 'HH:mm'),
      sessoesContador: agenda.sessoesContador,
      client: {
        name: agenda.client.name,
        quantidadeSessoes: agenda.client.quantidadeSessoes,
      },
    }));
  }
}

export { ListAgendaService };
