"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientController = void 0;
const UpdateClientService_1 = require("../../services/client/UpdateClientService");
class UpdateClientController {
    async handle(req, res) {
        const { id } = req.params;
        const { name, email, cpf, telefone, endereco, tipoPlano, planoFamiliar, dataVencimento, valorPlano, quantidadeSessoes, situacao } = req.body;
        const updateClientService = new UpdateClientService_1.UpdateClientService();
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
exports.UpdateClientController = UpdateClientController;
