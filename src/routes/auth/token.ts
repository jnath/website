import type { ServerResponse } from "http";
import User from "../../db/User";
import { genToken, verify } from "../../lib/jwt";

export async function post(req, res: ServerResponse) {
  const refreshToken: string = req.body.refreshToken;
  const isValidRefreshTokenToken = await verify(refreshToken);
  if (!isValidRefreshTokenToken) return res.writeHead(403).end();

  const user = await User.findByRefreshToken(refreshToken);
  if (!user) return res.writeHead(403).end();

  const token = await genToken(user);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ token }));
}
