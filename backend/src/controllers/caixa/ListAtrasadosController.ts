import { Request, Response } from 'express';
import { ListAtrasadosService } from '../../services/caixa/ListAtrasadosService';

class ListAtrasadosController {
  async handle(req: Request, res: Response) {
    const listAtrasadosService = new ListAtrasadosService();
    const caixa = await listAtrasadosService.execute();

    return res.json(caixa);
  }
}

export { ListAtrasadosController };
