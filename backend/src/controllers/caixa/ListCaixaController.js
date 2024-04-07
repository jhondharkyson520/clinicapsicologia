"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCaixaController = void 0;
const ListCaixaService_1 = require("../../services/caixa/ListCaixaService");
class ListCaixaController {
    async handle(req, res) {
        const listCaixaService = new ListCaixaService_1.ListCaixaService();
        const caixa = await listCaixaService.execute();
        return res.json(caixa);
    }
}
exports.ListCaixaController = ListCaixaController;
