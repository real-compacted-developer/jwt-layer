import { Router, Request, Response } from "express";
import jsonwebtoken from "../../modules/jwt"
import ERROR_CODE from '../../constants/errorCode';

const router = Router();

declare module 'express-serve-static-core' {
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
 * @apiName GetQuestions
 * @apiGroup Question
 *
 * @apiParam {String} roomNumber 유일한 방 번호
 *
 * @apiSuccess {Boolean} success API 호출 성공 여부
 * @apiSuccess {String} message 응답 메시지
 * @apiSuccess {Object} data 해당 방의 질문 리스트
 */
router.get("/isLoggedIn", async function (req: Request, res: Response) {
  try {
    /**
     * Express에서 req.headers의 값들은 자동적으로 소문자로 변환시켜서 
     * Authorization으로 요청하더라도 authorization으로 값이 출력된다.
     * (단, Request를 할 때는 반드시 Authorization을 header에 담아서 요청해야 한다.)
    */
    let { authorization } : any = req.headers;
    // 토큰이 헤더에 없는 경우
    if (!authorization) {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.EMPTY_TOKEN,
      };
      res.status(404).send(responseJSON);
    }
    // 토큰이 헤더에 있는 경우
    else {
      // Access Token이 Bearer로 시작하는 경우
      if (authorization.startsWith('Bearer ')) {
        authorization = authorization.slice(7, authorization.length);

        //만든 jwt 모듈 사용하여 토큰 확인
        const user = await jsonwebtoken.verify(authorization);
        req.decoded = user;
        const responseJSON: SuccessResponse = {
          success: true,
          message: "당신은 로그인 유저입니다.",
        };
        res.status(200).send(responseJSON)
      } 
      // Access Token이 Bearer로 시작하지 않는 경우
      else {
        console.log('Bearer 에러');
        const responseJSON: FailResponse = {
          success: false,
          message: ERROR_CODE.INVALID_TOKEN,
        };
        res.status(404).send(responseJSON);
      }
    }
  } catch (err) {
    // console.log('verify에서 throw한 err를 받음');
    if (err.name === 'TokenExpiredError') {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.EXPIRED_TOKEN,
      };
      res.status(404).send(responseJSON);
    } else if (err.name === 'JsonWebTokenError') {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.INVALID_TOKEN,
      };
      res.status(404).send(responseJSON);
    } else {
      const responseJSON: FailResponse = {
        success: false,
        message: ERROR_CODE.INVALID_TOKEN,
      };
      res.status(404).send(responseJSON);
    }
  }
});

export default router;