import jwt from 'jsonwebtoken';
import 'dotenv/config';

const jsonwebtoken = {
  sign: () => {
    const payload = {
      id: 'test'
    };
    const options: any = {
      algorithm: 'HS256', // H256(algorithm)에 해당하는 header, payload, signiture가 있음(내정)
      expiresIn: '12h',
      issuer: 'ConnectClass'
    };

    const result = {
      token: `Bearer ${jwt.sign(payload, process.env.JWT_SECRET_KEY!, options)}`
    };
    return result;
  },
  verify: (token: any) : any => {
    /**
       * verify 함수 : JWT 토큰을 해독하는 함수
       * 첫 번째 인자(token) : 해독할 JWT 토큰
       * 두 번째 인자(secretOrPublicKey) : JWT를 암호화시켰던 비밀번호
       * 출력값 : JWT 토큰에 담겨있었던 payload
       */
    return jwt.verify(token, process.env.JWT_SECRET_KEY!);
  }
};

export default jsonwebtoken;
