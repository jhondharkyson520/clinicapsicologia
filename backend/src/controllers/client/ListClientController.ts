import { Request, Response } from "express";
import { ListClientService } from "../../services/client/ListClientService";

class ListClientController{
    async handle(req: Request, res: Response){

        const listClientService = new ListClientService();
        const client = await listClientService.execute();

        return res.json(client);

    }
}

export { ListClientController }