import prismaClient from '../../prisma';
import { DateTime } from 'luxon';

interface AgendaItem {
  name: string;
  dataConsulta: string;
  horarioConsulta: string;
  sessoesContador: number;
  quantidadeSessoes: number;
  client_id: string;
}

class ListProximaService {
  async execute(): Promise<AgendaItem[]> {
    const dataAtual = DateTime.local();

    try {
      const agendas = await prismaClient.agenda.findMany({
        select: {
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

      console.log('Agendas from Prisma:', agendas);

      const agendaItems: AgendaItem[] = agendas.map((agenda) => {
        try {
          const dataConsulta = DateTime.fromJSDate(agenda.dataConsulta);
          const horarioConsulta = DateTime.fromJSDate(agenda.horarioConsulta);

          if (!dataConsulta.isValid || !horarioConsulta.isValid) {
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
            name: agenda.client.name,
            dataConsulta: dataFormatada,
            horarioConsulta: horaFormatada,
            sessoesContador: agenda.sessoesContador,
            quantidadeSessoes: agenda.client.quantidadeSessoes,
            client_id: agenda.client.id,
          };
        } catch (error) {
          console.error('Error processing agenda item:', error.message);
          return null;
        }
      });

      console.log('Agenda Items:', agendaItems);

      const filteredAgendaItems = agendaItems.filter((agenda) => {
        if (!agenda) {
          return false;
        }

        const dataConsulta = DateTime.fromFormat(agenda.dataConsulta, 'dd/MM/yyyy');

        return dataConsulta > dataAtual || dataConsulta.hasSame(dataAtual, 'day');
      }) as AgendaItem[];

      console.log('Filtered Agenda Items:', filteredAgendaItems);

      return filteredAgendaItems;
    } catch (error) {
      console.error('Error fetching agendas from Prisma:', error.message);
      return [];
    }
  }
}

export { ListProximaService };
