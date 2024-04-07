"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCaixaController = void 0;
const CreateCaixaService_1 = require("../../services/caixa/CreateCaixaService");
class CreateCaixaController {
    async handle(req, res) {
        const { valorPago, client_id } = req.body;
        if (valorPago === 0) {
            return;
        }
        const createCaixaService = new CreateCaixaService_1.CreateCaixaService();
        const caixa = await createCaixaService.execute({
            valorPago,
            client_id
        });
        return res.json(caixa);
    }
}
exports.CreateCaixaController = CreateCaixaController;
