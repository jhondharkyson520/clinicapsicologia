import prismaClient from '../../prisma';
import { DateTime } from 'luxon';

interface AgendaItem {
  id: string;
  name: string;
  dataConsulta: string;
  horarioConsulta: string;
  sessoesContador: number;
  quantidadeSessoes: number;
  client_id: string;
}

class ListProximaService {
  async execute(): Promise<AgendaItem[]> {
    const dataAtual = DateTime.local().toISODate();

    try {
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
              id: true,
            },
          },
        },       
      });

      
      const agendaItems: AgendaItem[] = agendas.map((agenda) => {
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
      
        
        const dataConsultaFormatted = DateTime.fromFormat(agenda.dataConsulta, 'dd/MM/yyyy').toISODate();
      
        return dataConsultaFormatted === dataAtual;

      }).sort((a, b) => {

        return DateTime.fromFormat(a.horarioConsulta, 'HH:mm').toMillis() - DateTime.fromFormat(b.horarioConsulta, 'HH:mm').toMillis();
      
      });
      

      console.log('Filtered Agenda Items:', filteredAgendaItems);

      return filteredAgendaItems;
    } catch (error) {
      console.error('Error fetching agendas from Prisma:', error.message);
      return [];
    }
  }
}

export { ListProximaService };
