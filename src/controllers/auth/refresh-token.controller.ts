import env from '../../constants/env';
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwtDecoded, JwtError } from '../../@types/jwt';

export interface JwtPayloadCustom extends JwtPayload {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export async function handle(req: Request, res: Response) {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET, (err: JwtError, decoded: JwtDecoded) => {
    if (err || !decoded) return res.sendStatus(403);
    const user = decoded as JwtPayloadCustom;

    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: '15m',
      }
    );

    return res.json({ accessToken });
  });
}
