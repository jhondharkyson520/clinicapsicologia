import { Request, Response } from 'express';
import { ListAgendaService } from '../../services/agenda/ListAgendaService';

class ListAgendaController {
  async handle(req: Request, res: Response) {
    const listAgendaService = new ListAgendaService();
    const agendas = await listAgendaService.execute();

    return res.json(agendas);
  }
}

export { ListAgendaController };
