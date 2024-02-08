import prismaClient from '../../prisma';

class LastCaixaService {
  async execute(clientId: string) {
    try {
      
      const lastCaixa = await prismaClient.caixa.findFirst({
        where: { client_id: clientId },
        orderBy: { dataOperacao: 'desc' },
      });

      return lastCaixa;
    } catch (error) {
      throw new Error('Erro ao buscar a última caixa');
    }
  }
}

export { LastCaixaService };
