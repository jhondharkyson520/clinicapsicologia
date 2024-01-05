import prismaClient from '../../prisma';

class DeleteClientService {
  async execute(clientId: string) {
    if (!clientId) {
      throw new Error("É necessário fornecer o ID do cliente para a exclusão.");
    }

    const existingClient = await prismaClient.clients.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      throw new Error(`Não foi possível encontrar um cliente com o ID ${clientId}.`);
    }

    await prismaClient.agenda.deleteMany({
      where: { client_id: clientId },
    });

    await prismaClient.caixa.deleteMany({
      where: { client_id: clientId },
    });

    const client = await prismaClient.clients.delete({
      where: { id: clientId },
    });

    return client;
  }
}

export { DeleteClientService };
