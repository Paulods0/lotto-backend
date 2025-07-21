import type { Request, Response } from "express"

export async function extractToken(req: Request) {
    const authHeader = req.headers.authorization
    if(!authHeader) return null

    const parts = authHeader.split(" ")
    if(parts.length !== 2 || parts[0] !== "Bearer") return null
    
    const token = parts[1]
    return token
}

export async function logoutController(req:Request, res:Response) {
        const token = extractToken(req)

        if(!token) return res.status(400).json({ message:"Token não fornecido." })

        return res.status(200).json({ message:"Logout realizado com sucesso." })
}