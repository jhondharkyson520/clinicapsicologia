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

    // Obter o cliente com base no client_id
    const client = await prismaClient.clients.findUnique({
      where: { id: client_id },
    });

    if (!client) {
      throw new Error("Cliente não encontrado!");
    }

    // Obter o último registro de caixa para o cliente
    const lastCaixa = await prismaClient.caixa.findFirst({
      where: { client_id: client_id },
      orderBy: { dataOperacao: 'desc' },
    });

    // Calcular valorPlano e valorAberto
    const valorPlano = client.valorPlano.toString();
    const valorAberto = lastCaixa
      ? Decimal.sub(
          Decimal.add(lastCaixa.valorAberto, client.valorPlano),
          valorPago
        ).toString()
      : Decimal.sub(client.valorPlano, valorPago).toString();

    // Criar registro no caixa
    const caixa = await prismaClient.caixa.create({
      data: {
        dataOperacao: new Date(),
        client_id: client_id,
        valorPlano: valorPlano,
        valorAberto: valorAberto,
        valorPago: valorPago,
      },
    });

    return caixa;
  }
}

export { CreateCaixaService };
