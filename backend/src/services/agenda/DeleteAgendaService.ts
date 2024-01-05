import prismaClient from '../../prisma';

class DeleteAgendaService {
  async execute(clientId: string) {
    if (!clientId) {
      throw new Error("É necessário fornecer o ID do cliente para a exclusão.");
    }

    const existingClient = await prismaClient.agenda.findUnique({
      where: { id: clientId },
    });

    if (!existingClient) {
      throw new Error(`Não foi possível encontrar um cliente com o ID ${clientId}.`);
    }
    
    const client = await prismaClient.agenda.delete({
      where: { id: clientId },
    });

    console.log("Agendamento deletado com sucesso");
    

    return client;
  }
}

export { DeleteAgendaService };
