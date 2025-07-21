import type { Request, Response } from "express"
import { idSchema } from "../../validations/@common/id.schema"
import { deleteTerminalService } from "../../services/terminal/delete-terminal.service"

export async function deleteTerminalController(req: Request, res: Response) {
    const { id } = idSchema.parse(req.params)

    await deleteTerminalService(id)

    return res.status(200).json({
        message: "Terminal removido com sucesso"
    })
}