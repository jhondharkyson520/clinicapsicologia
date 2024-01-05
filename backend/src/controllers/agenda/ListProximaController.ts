import { Request, Response } from 'express';
import { ListProximaService } from '../../services/agenda/ListProximaService';

class ListProximaController {
  async handle(req: Request, res: Response) {
    const listProximaService = new ListProximaService();
    const agendas = await listProximaService.execute();

    return res.json(agendas);
  }
}

export { ListProximaController };
