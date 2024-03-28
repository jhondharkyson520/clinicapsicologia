import prismaClient from '../../prisma';
import { format } from 'date-fns';

class ListAtrasadosService {
  
  async execute() {
    const uniqueClients: { [clientId: string]: any } = {};

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
        client: true,
      },
    });
    //console.log('Todas as entradas do caixa:', caixaEntries);

    for (const entry of caixaEntries) {
      const clientId = entry.client.id;

      //console.log('Processando entrada:', entry);

     
      if (!uniqueClients[clientId] || entry.dataOperacao > uniqueClients[clientId].dataOperacao) {
        //console.log('Atualizando entrada mais recente para o cliente:', entry);
        uniqueClients[clientId] = entry;
      }
    }

    const filteredEntries = Object.values(uniqueClients).filter(entry => entry.valorAberto < 0);

    const results = filteredEntries.map(entry => ({
      id: entry.id,
      dataOperacao: format(new Date(entry.dataOperacao), 'dd/MM/yyyy'),
      valorPlano: parseFloat(entry.valorPlano).toFixed(2),
      valorAberto: parseFloat(entry.valorAberto.toString()).toFixed(2),
      client: { id: entry.client.id, name: entry.client.name },
    }));

    for (const entry of results) {
      const clientId = entry.client.id;
      //console.log('idcliend', entry.client.id);
      
      if (uniqueClients[clientId]) {
        await prismaClient.clients.update({
          where: { id: entry.client.id },
          data: { situacao: false }
        });
      }
    }

    /// está mudando todos os clients para false

    return results;
  }
}

export { ListAtrasadosService };
