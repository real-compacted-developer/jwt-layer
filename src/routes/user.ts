import { Request, Response, Router } from 'express';
import axios from 'axios';
import * as getUserInfo from '../middleware/auth';

const router = Router();

type SuccessResponse = {
  success: true;
  message: string;
  data : any;
};

/**
 * @api {post} /
 * @apiName getUserInfo
 * @apiGroup user
 *
 * @apiBody id : User Id
 *
 * @apiSuccess {Boolean} success token 유효 여부
 * @apiSuccess {String} message 응답 메시지
 */
router.route('/').post([getUserInfo], async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.decoded);
    const { id } = req.decoded;
    const user = await axios.get(`http://db.api.connectclass.io/user/${id}`);
    const responseJSON: SuccessResponse = {
      success: true,
      message: id,
      data : user.data.data
    };
    res.status(200).send(responseJSON);
  } catch (err) {
    return err
  }
});

export default router;
