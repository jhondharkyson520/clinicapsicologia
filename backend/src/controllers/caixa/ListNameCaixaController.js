"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNameCaixaController = void 0;
const ListNameCaixaService_1 = require("../../services/caixa/ListNameCaixaService");
class ListNameCaixaController {
    async handle(req, res) {
        const caixa_id = req.query.caixa_id;
        const listByName = new ListNameCaixaService_1.ListNameCaixaService;
        const caixa = await listByName.execute({
            caixa_id
        });
        return res.json(caixa);
    }
}
exports.ListNameCaixaController = ListNameCaixaController;
