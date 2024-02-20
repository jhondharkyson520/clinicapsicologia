import prismaClient from '../../prisma';
import { format } from 'date-fns';

class ListAtrasadosService {
  async execute() {
    const uniqueClients: { [clientId: string]: any } = {};

    // Buscar todas as entradas do caixa
    const caixaEntries = await prismaClient.caixa.findMany({
      orderBy: [
        { client: { id: 'asc' } },
        { dataOperacao: 'desc' },
      ],
      select: {
        id: true,
        dataOperacao: true,
        valorPlano: true,
        valorAberto: true,
        client: { select: { id: true, name: true} },
      },
    });

    
    for (const entry of caixaEntries) {
      const clientId = entry.client.id;
      const valorAberto = parseFloat(entry.valorAberto.toString());
      if (valorAberto > 0 && (!(clientId in uniqueClients) || entry.dataOperacao > uniqueClients[clientId].dataOperacao)) {
        uniqueClients[clientId] = entry;
      }
    }

   
    const results = Object.values(uniqueClients).map(entry => ({
      id: entry.id,
      dataOperacao: format(new Date(entry.dataOperacao), 'dd/MM/yyyy'),
      valorPlano: parseFloat(entry.valorPlano).toFixed(2),
      valorAberto: parseFloat(entry.valorAberto).toFixed(2),
      client: { id: entry.client.id, name: entry.client.name },
    }));

    return results;
  }
}

export { ListAtrasadosService };
