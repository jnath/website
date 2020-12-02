import type { UserDoc } from "../db/User";
import jwt from "jsonwebtoken";
import config from "../config";

export type { VerifyErrors } from "jsonwebtoken";

export async function genToken(user: UserDoc) {
  return jwt.sign(user.toJSON(), config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
}

export async function genRefreshToken(user: UserDoc) {
  const refreshToken = jwt.sign(user.toJSON(), config.jwt.secret);
  user.refreshTokens.push(refreshToken);
  await user.save();
  return refreshToken;
}

export async function newToken(user: UserDoc, refreshToken: string) {
  if (user.refreshTokens.includes(refreshToken)) {
    return genToken(user);
  }

  throw new Error("Invalide refreshToken");
}

export async function delRefreshToken(user: UserDoc, refreshToken: string) {
  user.refreshTokens = user.refreshTokens.filter((r) => r !== refreshToken);
  return user.save();
}

export async function verify<T>(token: string) {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decode) => {
      if (err) {
        reject(err);
        return;
      }

      resolve((decode as any) as T);
    });
  });
}
