import { NextFunction, Response, Request } from 'express';

function hasPermission(action: string) {
  return (req: Request, res: Response, next: NextFunction) => {};
}
