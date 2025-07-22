import type { Request, Response } from "express"
import { loginService } from "../../services/auth/login-service"
import { loginSchema } from "../../validations/auth/login-schema"

export async function loginController(req: Request, res: Response) {

    const body = loginSchema.parse(req.body)
    const { token } = await loginService(body)

    res.cookie("token", token, {
        path: "/",
        secure: true,
        sameSite: "strict",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "Login bem sucedido."
    })
}