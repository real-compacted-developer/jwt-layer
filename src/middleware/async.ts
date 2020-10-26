import { Request, Response, NextFunction } from 'express';

exports.asyncHandler = (fn : any) => (req : Request, res : Response, next : NextFunction) => Promise
  .resolve(fn(req, res, next))
  .catch(next);
