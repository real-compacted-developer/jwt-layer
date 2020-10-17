import { Request, Response, Router } from 'express';
import jsonwebtoken from '../../modules/jwt';
import ERROR_CODE from '../../constants/errorCode';

const router = Router();

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-shadow
  interface Request {
    decoded: any;
  }
}
type SuccessResponse = {
  success: true;
  message: string;
};

type FailResponse = {
  success: false;
  message: string;
};

/**
 * @api {get} /isLoggedIn
 * @apiName isLoggedIn
 * @apiGroup Validation/Auth
 *
 * @apiHeader authorization
 *
 * @apiSuccess {Boolean} success token 유효 여부
 * @apiSuccess {String} message 응답 메시지
 */
router.get('/isLoggedIn', async (req: Request, res: Response) => {
  try {
    /**
     * Express에서 req.headers의 값들은 자동적으로 소문자로 변환시켜서
     * Authorization으로 요청하더라도 authorization으로 값이 출력된다.
     * (단, Request를 할 때는 반드시 Authorization을 header에 담아서 요청해야 한다.)
     */
    let { authorization }: any = req.headers;

    // 토큰이 헤더에 없는 경우
    if (!authorization) {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.EMPTY_TOKEN
      };
      res.status(404).send(responseJSON);
    } else if (authorization.startsWith('Bearer ')) { // Access Token이 Bearer로 시작하는 경우
      authorization = authorization.slice(7, authorization.length);
      // 만든 jwt 모듈 사용하여 토큰 확인
      const user = await jsonwebtoken.verify(authorization);
      req.decoded = user;
      const responseJSON: SuccessResponse = {
        success: true,
        message: '당신은 로그인 유저입니다.'
      };
      res.status(200).send(responseJSON);
    } else { // Access Token이 Bearer로 시작하지 않는 경우
      console.log('Bearer 에러');
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.INVALID_TOKEN
      };
      res.status(404).send(responseJSON);
    }
  } catch (err) {
    // console.log('verify에서 throw한 err를 받음');
    if (err.name === 'TokenExpiredError') {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.EXPIRED_TOKEN
      };
      res.status(404).send(responseJSON);
    } else if (err.name === 'JsonWebTokenError') {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.INVALID_TOKEN
      };
      res.status(404).send(responseJSON);
    } else {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.INVALID_TOKEN
      };
      res.status(404).send(responseJSON);
    }
  }
});

export default router;
