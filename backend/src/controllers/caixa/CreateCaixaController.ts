import { Request, Response } from 'express';
import { CreateCaixaService } from '../../services/caixa/CreateCaixaService';

class CreateCaixaController {
  async handle(req: Request, res: Response) {
    const { valorPago, client_id } = req.body;

    if(valorPago === 0){
      return;
    }

    const createCaixaService = new CreateCaixaService();

    const caixa = await createCaixaService.execute({
      
      valorPago,
      client_id
    });

    return res.json(caixa);
  }
}

export { CreateCaixaController };
