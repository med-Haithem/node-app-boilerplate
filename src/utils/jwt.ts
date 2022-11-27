import jwt from "jsonwebtoken";

export const generateJWT = async ({ secretKey, payload, signOption }: any) => {
  const token = `${jwt.sign(payload, secretKey, signOption)}`;
  return token;
};

export const verifyJWT = async ({ token, secretKey, signOption }: any) => {
  const data = jwt.verify(token, secretKey, signOption);
  return data;
};
