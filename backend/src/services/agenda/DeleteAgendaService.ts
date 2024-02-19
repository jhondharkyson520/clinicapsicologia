import prismaClient from '../../prisma';

class DeleteAgendaService {
  async execute(agendaId: string) {
    if (!agendaId) {
      throw new Error("É necessário fornecer o ID do agendamento para a exclusão.");
    }

    const existingAgenda = await prismaClient.agenda.findUnique({
      where: { id: agendaId },
    });

    if (!existingAgenda) {
      throw new Error(`Não foi possível encontrar um agendamento com o ID ${agendaId}.`);
    }
    
    const agenda = await prismaClient.agenda.delete({
      where: { id: agendaId },
    });

    console.log("Agendamento deletado com sucesso");
    

    return agenda;
  }
}

export { DeleteAgendaService };
