import prismaClient from '../../prisma';
import { format, parseISO } from 'date-fns';

interface Agenda {
  id: string;
  dataConsulta: string;
  horarioConsulta: string;
  sessoesContador: number;
  client: {
    name: string;
    quantidadeSessoes: number | null;
  };
}

class ListAgendaService {
  async execute(): Promise<Agenda[]> {
    const agendas = await prismaClient.agenda.findMany({
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

      // Converter data para "dd/MM/yyyy"
      const dataFormatada = new Date(agenda.dataConsulta).toLocaleDateString('pt-BR');

      // Converter hora para "HH:mm"
      const horaFormatada = new Date(agenda.horarioConsulta).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC', // Adicionando timezone UTC
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

export { ListAgendaService, Agenda };
