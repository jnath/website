import User from "../../db/User";
import { genRefreshToken, genToken } from "../../lib/jwt";

export async function post(req, res) {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save({
      validateBeforeSave: true,
    });
    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    const token = await genToken(user);
    const refreshToken = await genRefreshToken(user);
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ token, refreshToken }));
  } catch (err) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: {
          message: "try login you are mayby allready registred",
        },
      })
    );
  }
}
