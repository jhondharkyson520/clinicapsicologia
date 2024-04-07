"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailClientController = void 0;
const DetailClientService_1 = require("../../services/client/DetailClientService");
class DetailClientController {
    async handle(req, res) {
        const id = req.params.id;
        const detailClientService = new DetailClientService_1.DetailClientService();
        const client = await detailClientService.execute({
            id
        });
        console.log(id);
        return res.json(client);
    }
}
exports.DetailClientController = DetailClientController;
