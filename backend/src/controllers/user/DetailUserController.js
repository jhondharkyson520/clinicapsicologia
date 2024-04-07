"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailUserController = void 0;
const DetailUserService_1 = require("../../services/user/DetailUserService");
class DetailUserController {
    async handle(req, res) {
        const user_id = req.user_id;
        const detailUserService = new DetailUserService_1.DetailUserService();
        const user = await detailUserService.execute(user_id);
        return res.json(user);
    }
}
exports.DetailUserController = DetailUserController;
