"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUserController = void 0;
const ListUserService_1 = require("../../services/user/ListUserService");
class ListUserController {
    async handle(req, res) {
        const listUserService = new ListUserService_1.ListUserService();
        const user = await listUserService.execute();
        return res.json(user);
    }
}
exports.ListUserController = ListUserController;
