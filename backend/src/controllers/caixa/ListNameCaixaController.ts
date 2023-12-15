import { Request, Response } from "express";
import { ListNameCaixaService } from "../../services/caixa/ListNameCaixaService";


class ListNameCaixaController{
    async handle(req: Request, res: Response){

        const caixa_id = req.query.caixa_id as string;
        const listByName = new ListNameCaixaService;
        const caixa = await listByName.execute({
            caixa_id
        });

        return res.json(caixa);


    }
}

export {ListNameCaixaController}