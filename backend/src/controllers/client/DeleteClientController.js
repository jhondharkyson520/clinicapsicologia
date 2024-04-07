"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteClientController = void 0;
const DeleteClientService_1 = require("../../services/client/DeleteClientService");
class DeleteClientController {
    async handle(req, res) {
        const { id } = req.params;
        const deleteClientService = new DeleteClientService_1.DeleteClientService();
        await deleteClientService.execute(id);
        return res.status(204).send();
    }
}
exports.DeleteClientController = DeleteClientController;
