import { Decimal } from '@prisma/client/runtime/library';
import prismaClient from '../../prisma';

interface CaixaRequest {
  client_id: string;
  valorPago: string;
}

class CreateCaixaService {
  async execute({ client_id, valorPago }: CaixaRequest) {
    if (client_id === "" || valorPago === "") {
      throw new Error("Preencha todos os campos!");
    }

    const client = await prismaClient.clients.findUnique({
      where: { id: client_id },
    });

    if (!client) {
      throw new Error("Cliente não encontrado!");
    }

    const lastCaixa = await prismaClient.caixa.findFirst({
      where: { client_id: client_id },
      orderBy: { dataOperacao: 'desc' },
    });

    const valorPlano = client.valorPlano.toString();
    const valorAberto = lastCaixa
    ? Decimal.sub(lastCaixa.valorAberto, valorPago).toString()
    : Decimal.sub(client.valorPlano, valorPago).toString();

    const caixa = await prismaClient.caixa.create({
      data: {
        dataOperacao: new Date(),
        client_id: client_id,
        valorPlano: valorPlano,
        valorAberto: valorAberto,
        
      },
    });

    return caixa;
  }
}

export { CreateCaixaService };
