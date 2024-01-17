// DetailClientController.ts
import { Request, Response } from "express";
import { DetailClientService } from '../../services/client/DetailClientService';

class DetailClientController {
    async handle(req: Request, res: Response) {
        const id = req.params.id; // Use req.params para obter o parâmetro da rota

        const detailClientService = new DetailClientService();

        const client = await detailClientService.execute({
            id
        });

        console.log(id);

        return res.json(client);
    }
}

export { DetailClientController };
