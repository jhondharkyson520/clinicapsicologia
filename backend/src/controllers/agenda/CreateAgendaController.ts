import { Request, Response } from 'express';
import { CreateAgendaService } from '../../services/agenda/CreateAgendaService';

class CreateAgendaController {
  async handle(req: Request, res: Response) {
    const { dataConsulta, horarioConsulta, client_id, sessoesContador } = req.body;

    const createAgendaService = new CreateAgendaService();

    const agenda = await createAgendaService.execute({
      dataConsulta,
      horarioConsulta,
      client_id,
      sessoesContador,
    });

    return res.json(agenda);
  }
}

export { CreateAgendaController };
