"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserPasswordController = void 0;
const UpdateUserPasswordService_1 = require("../../services/user/UpdateUserPasswordService");
class UpdateUserPasswordController {
    async handle(req, res) {
        const { userId } = req.params;
        const { newPassword } = req.body;
        const updateUserPasswordService = new UpdateUserPasswordService_1.UpdateUserPasswordService();
        const user = await updateUserPasswordService.execute({
            userId,
            newPassword,
        });
        return res.json(user);
    }
}
exports.UpdateUserPasswordController = UpdateUserPasswordController;
