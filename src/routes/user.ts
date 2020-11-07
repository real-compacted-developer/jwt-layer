import { Request, Response, NextFunction, Router } from 'express';
import { IncomingHttpHeaders } from 'http';
import axios from 'axios';
import ErrorResponse from '../utils/errorResponse';
import ERROR_CODE from '../constants/errorCode';
import jwt from '../modules/jwt';

const router = Router();

type SuccessResponse = {
  success: true;
  message?: string;
  data : any;
};

type FailResponse = {
  success: false;
  message: string;
};
type Decode = {
  id: string,
  isPremium: boolean,
  iat: number,
  exp: number,
  iss: string
}
/**
 * @api {get} /
 * @apiName getUserInfo
 * @apiGroup user
 *
 * @apiBody id : User Id
 *
 * @apiSuccess {Boolean} success token 유효 여부
 * @apiSuccess {String} message 응답 메시지
 */
// eslint-disable-next-line consistent-return
router.get('/', async (req: Request, res: Response, next : NextFunction) => {
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
    const decoded : Decode = await jwt.verify(token);
    const user = await axios.get(`https://db.connectclass.io/user/${decoded.id}`);
    const responseJSON: SuccessResponse = {
      success: true,
      data: user.data.data
    };
    res.status(200).send(responseJSON);
  } catch (error) {
    return next(new ErrorResponse(ERROR_CODE.UNAUTHORIZED, 401));
  }
});

export default router;
