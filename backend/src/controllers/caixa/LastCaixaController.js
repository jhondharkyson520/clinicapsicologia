"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastCaixaController = void 0;
const LastCaixaService_1 = require("../../services/caixa/LastCaixaService");
class LastCaixaController {
    async handle(req, res) {
        try {
            const { id } = req.params;
            const lastCaixaService = new LastCaixaService_1.LastCaixaService();
            const lastCaixa = await lastCaixaService.execute(id);
            return res.json(lastCaixa);
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.LastCaixaController = LastCaixaController;
