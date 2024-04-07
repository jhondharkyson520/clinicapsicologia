"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProximaController = void 0;
const ListProximaService_1 = require("../../services/agenda/ListProximaService");
class ListProximaController {
    async handle(req, res) {
        const listProximaService = new ListProximaService_1.ListProximaService();
        const agendas = await listProximaService.execute();
        return res.json(agendas);
    }
}
exports.ListProximaController = ListProximaController;
