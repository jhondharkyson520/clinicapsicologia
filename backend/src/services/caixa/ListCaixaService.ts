import prismaClient from '../../prisma';
import { format } from 'date-fns';

class ListCaixaService {
  async execute() {
    const caixa = await prismaClient.caixa.findMany({
      select: {
        id: true,
        dataOperacao: true,
        valorPlano: true,
        valorAberto: true,
        valorPago: true,
        client:{
          select:{
            name: true,
          }
        }
      },
    });

    return caixa.map((caixa) => ({
      id: caixa.id,
      dataOperacao: format(new Date(caixa.dataOperacao), 'dd/MM/yyyy'),      
      valorPlano: caixa.valorPlano,
      valorAberto: caixa.valorAberto,
      valorPago: caixa.valorPago,
      client: {
        name: caixa.client.name,
      },
    }));
  }
}

export { ListCaixaService };
