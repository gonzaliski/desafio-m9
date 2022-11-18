import jsonwebtoken from "jsonwebtoken";

const SECRET = process.env.SECRET;

export function generateToken(param) {
  return jsonwebtoken.sign(param, SECRET);
}

export function decodeToken(token: string) {
  return jsonwebtoken.verify(token, SECRET) as jsonwebtoken.JwtPayload;
}
