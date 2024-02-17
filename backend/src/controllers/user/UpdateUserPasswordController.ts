import { Request, Response } from "express";
import { UpdateUserPasswordService } from "../../services/user/UpdateUserPasswordService";

class UpdateUserPasswordController {
  async handle(req: Request, res: Response) {
    const { userId } = req.params;
    const { newPassword } = req.body;

    const updateUserPasswordService = new UpdateUserPasswordService();

    const user = await updateUserPasswordService.execute({
      userId,
      newPassword,
    });

    return res.json(user);
  }
}

export { UpdateUserPasswordController };
