"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListClientController = void 0;
const ListClientService_1 = require("../../services/client/ListClientService");
class ListClientController {
    async handle(req, res) {
        const listClientService = new ListClientService_1.ListClientService();
        const client = await listClientService.execute();
        return res.json(client);
    }
}
exports.ListClientController = ListClientController;
