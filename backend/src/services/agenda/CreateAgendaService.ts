import prismaClient from '../../prisma';

interface AgendaRequest {
  dataConsulta: string;
  horarioConsulta: string;
  client_id: string; 
  sessoesContador: number;
}

class CreateAgendaService {
  async execute({
    dataConsulta,
    horarioConsulta,
    client_id,
    sessoesContador,
  }: AgendaRequest) {
    if (
      dataConsulta === "" ||
      horarioConsulta === "" ||
      client_id === "" ||
      sessoesContador === null       
    ) {
      throw new Error("Preencha todos os campos!");
    }

    const agenda = await prismaClient.agenda.create({
      data: {
        dataConsulta: new Date(dataConsulta),
        horarioConsulta: new Date(horarioConsulta),
        client_id: client_id,
        sessoesContador: sessoesContador,
      },
    });

    return agenda;
  }
}

export { CreateAgendaService };
