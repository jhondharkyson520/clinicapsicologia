"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClientController = void 0;
const CreateClientService_1 = require("../../services/client/CreateClientService");
class CreateClientController {
    async handle(req, res) {
        const { name, email, cpf, telefone, endereco, tipoPlano, planoFamiliar, dataVencimento, valorPlano, quantidadeSessoes, situacao, } = req.body;
        const createClientService = new CreateClientService_1.CreateClientService();
        const client = await createClientService.execute({
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
        return res.json(client);
    }
}
exports.CreateClientController = CreateClientController;
