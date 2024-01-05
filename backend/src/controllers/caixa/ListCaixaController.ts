import { Request, Response } from 'express';
import { ListCaixaService } from '../../services/caixa/ListCaixaService';

class ListCaixaController {
  async handle(req: Request, res: Response) {
    const listCaixaService = new ListCaixaService();
    const caixa = await listCaixaService.execute();

    return res.json(caixa);
  }
}

export { ListCaixaController };