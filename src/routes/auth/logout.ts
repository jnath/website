import type { ServerResponse } from "http";
import User from "../../db/User";
import { delRefreshToken } from "../../lib/jwt";

export async function post(req, res: ServerResponse) {
  const refreshToken = req.body.refreshToken;

  const user = await User.findByRefreshToken(refreshToken);
  if (!user) return res.writeHead(403).end();

  await delRefreshToken(user, refreshToken);

  res.writeHead(204).end();
}
