"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAgendaController = void 0;
const DeleteAgendaService_1 = require("../../services/agenda/DeleteAgendaService");
class DeleteAgendaController {
    async handle(req, res) {
        const { id } = req.params;
        console.log('teste de id', id);
        const deleteAgendaService = new DeleteAgendaService_1.DeleteAgendaService();
        await deleteAgendaService.execute(id);
        return res.status(204).send();
    }
}
exports.DeleteAgendaController = DeleteAgendaController;
