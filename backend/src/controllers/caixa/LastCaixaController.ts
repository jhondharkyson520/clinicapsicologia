import { Request, Response } from "express";
import { LastCaixaService } from "../../services/caixa/LastCaixaService";

class LastCaixaController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params; 

      const lastCaixaService = new LastCaixaService();
      const lastCaixa = await lastCaixaService.execute(id);
      
      return res.json(lastCaixa);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export { LastCaixaController };
