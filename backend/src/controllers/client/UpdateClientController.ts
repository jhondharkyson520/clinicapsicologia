import { Request, Response } from 'express';
import { UpdateClientService } from '../../services/client/UpdateClientService';

class UpdateClientController {
    async handle(req: Request, res: Response) {
      const { id } = req.params;
      const {name,
        email,
        cpf,
        telefone,
        endereco,
        tipoPlano,
        planoFamiliar,
        dataVencimento,
        valorPlano,
        quantidadeSessoes,
        situacao} = req.body

  
      const updateClientService = new UpdateClientService();
  
      const updatedClient = await updateClientService.execute({
        id,
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
  
      return res.json(id);
    }
  }
  
  export { UpdateClientController };