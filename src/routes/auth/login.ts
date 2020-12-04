import User from "../../db/User";
import { genRefreshToken, genToken } from "../../lib/jwt";

export async function post(req, res) {
  const { email, password } = req.body;

  const user = await User.findByCredentials(email, password);
  if (user) {
    const token = await genToken(user);
    const refreshToken = await genRefreshToken(user);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ token, refreshToken }));
  } else {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: {
          message: "your email or your password is wrong",
        },
      })
    );
  }
}
