import { Request, Response } from 'express';
import { DeleteAgendaService } from '../../services/agenda/DeleteAgendaService';

class DeleteAgendaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteAgendaService = new DeleteAgendaService();

    await deleteAgendaService.execute(id);

    return res.status(204).send(); 
  }
}

export { DeleteAgendaController };
