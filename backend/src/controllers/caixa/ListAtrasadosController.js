"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAtrasadosController = void 0;
const ListAtrasadosService_1 = require("../../services/caixa/ListAtrasadosService");
class ListAtrasadosController {
    async handle(req, res) {
        const listAtrasadosService = new ListAtrasadosService_1.ListAtrasadosService();
        const caixa = await listAtrasadosService.execute();
        return res.json(caixa);
    }
}
exports.ListAtrasadosController = ListAtrasadosController;
