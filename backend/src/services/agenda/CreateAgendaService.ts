import prismaClient from '../../prisma';

interface AgendaRequest {
  dataConsulta: string;
  horarioConsulta: string;
  client_id: string;
}

class CreateAgendaService {
  async execute({ dataConsulta, horarioConsulta, client_id }: AgendaRequest) {
    if (dataConsulta === '' || horarioConsulta === '' || client_id === '') {
      throw new Error('Preencha todos os campos!');
    }

    try {
      const client = await prismaClient.clients.findUnique({
        where: { id: client_id },
      });

      if (!client) {
        throw new Error('Cliente não encontrado');
      }

      const novaSessaoContador = (client.sessoesContador || 0) + 1;

      const agenda = await prismaClient.agenda.create({
        data: {
          dataConsulta: new Date(`${dataConsulta}T${horarioConsulta}:00.000Z`),
          horarioConsulta: new Date(`${dataConsulta}T${horarioConsulta}:00.000Z`),
          client: {
            connect: {
              id: client_id,
            },
          },
          sessoesContador: novaSessaoContador,
        },
      });

      // Atualize a situação do cliente se a quantidadeSessoes não for null
      if (client.quantidadeSessoes !== null && novaSessaoContador === client.quantidadeSessoes) {
        await prismaClient.clients.update({
          where: { id: client_id },
          data: { situacao: false },
        });
      }

      // Atualize o sessoesContador do cliente
      await prismaClient.clients.update({
        where: { id: client_id },
        data: { sessoesContador: novaSessaoContador },
      });

      return agenda;
    } catch (error) {
      throw new Error(`Erro ao criar agenda: ${error.message}`);
    }
  }
}

export { CreateAgendaService };
