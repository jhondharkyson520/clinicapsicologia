import { Request, Response } from "express";
import { CreateClientService } from "../../services/client/CreateClientService";

class CreateClientController {
  async handle(req: Request, res: Response) {
    const {
      name,
      email,
      cpf,
      telefone,
      endereco,
      tipoPlano,
      planoFamiliar,
      dataVencimento,
      valorPlano,
      quantidadeSessoes,
      situacao,
    } = req.body;

    const createClientService = new CreateClientService();

    const client = await createClientService.execute({
      name,
      email,
      cpf,
      telefone,
      endereco,
      tipoPlano,
      planoFamiliar,
      dataVencimento,
      valorPlano,
      quantidadeSessoes,
      situacao,
    });

    return res.json(client);
  }
}

export { CreateClientController };
