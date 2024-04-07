"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAgendaController = void 0;
const ListAgendaService_1 = require("../../services/agenda/ListAgendaService");
class ListAgendaController {
    async handle(req, res) {
        const listAgendaService = new ListAgendaService_1.ListAgendaService();
        const agendas = await listAgendaService.execute();
        return res.json(agendas);
    }
}
exports.ListAgendaController = ListAgendaController;
