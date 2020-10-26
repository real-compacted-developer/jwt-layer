import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import ErrorResponse from '../utils/errorResponse';
import ERROR_CODE from '../constants/errorCode';
import jwt from '../modules/jwt';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-shadow
  interface Request {
    decoded: any;
  }
}

type FailResponse = {
  success: false;
  message: string;
};

// eslint-disable-next-line consistent-return
exports.getUserInfo = async (req: Request, res: Response, next :NextFunction) => {
  const { authorization }: IncomingHttpHeaders = req.headers;
  let token = 'no token';
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.slice(7, authorization.length);
  } else {
    const responseJSON: FailResponse = {
      success: false,
      message: ERROR_CODE.EMPTY_TOKEN
    };
    res.status(404).send(responseJSON);
  }

  // Make sure token exists
  if (token === 'no token') {
    return next(new ErrorResponse(ERROR_CODE.UNAUTHORIZED, 401));
  }

  try {
    // Verify token
    const decoded = await jwt.verify(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return next(new ErrorResponse(ERROR_CODE.UNAUTHORIZED, 401));
  }
};
