// ListProximaService.ts

import prismaClient from '../../prisma';
import { format, isAfter, isToday, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

class ListProximaService {
  async execute() {
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
          }
        }
      },
    });

    const dataAtual = new Date();

    return agendas
      .filter((agenda) => {
        const dataConsulta = new Date(agenda.dataConsulta);
        return (
          isAfter(dataConsulta, dataAtual) ||
          (isToday(dataConsulta) && isAfter(new Date(agenda.horarioConsulta), dataAtual))
        );
      })
      .map((agenda) => ({
        name: agenda.client.name,
        dataConsulta: format(new Date(agenda.dataConsulta), 'dd/MM/yyyy - EEEE', { locale: ptBR }),
        horarioConsulta: format(new Date(agenda.horarioConsulta), 'HH:mm'),
        situacao: agenda.sessoesContador < agenda.client.quantidadeSessoes,
      }))
      .filter((agenda) => {
        const dataConsulta = new Date(agenda.dataConsulta);
        return !(isToday(dataConsulta) && new Date(agenda.horarioConsulta) <= dataAtual);
      });
  }
}

export { ListProximaService };
