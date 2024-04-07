"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAgendaController = void 0;
const CreateAgendaService_1 = require("../../services/agenda/CreateAgendaService");
class CreateAgendaController {
    async handle(req, res) {
        try {
            const { dataConsulta, horarioConsulta, client_id } = req.body;
            const createAgendaService = new CreateAgendaService_1.CreateAgendaService();
            const agenda = await createAgendaService.execute({
                dataConsulta,
                horarioConsulta,
                client_id,
            });
            return res.json(agenda);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.CreateAgendaController = CreateAgendaController;
