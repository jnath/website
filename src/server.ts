import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import session from "express-session";
import sessionFileStore from "session-file-store";
import bodyParser from "body-parser";
import * as db from "./db";
import config from "./config";
import { verify } from "./lib/jwt";
import client, { axiosMiddleware } from "./lib/axios";
import cors from "cors";
import ms from "ms";
import { pluginMiddleware } from "./plugins/server";

const FileStore = sessionFileStore(session);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

db.connect();

polka() // You can also use Express
  .use(
    cors(),
    axiosMiddleware(),
    bodyParser.json(),
    session({
      secret: config.session.secret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: ms(config.session.expire),
      },
      store: new FileStore({
        path: ".sessions",
      }),
    }),
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    pluginMiddleware(),
    // async (req, res, next) => {
    //   const plugins = (await import("./plugins")).default;
    //   Object.keys(plugins).forEach(async (name) => {
    //     let plugin = null;
    //     try {
    //       plugin = (await plugins[name].server).default;
    //     } catch (error) {}
    //     if (plugin) {
    //       plugin(req, res, next);
    //     }
    //   });
    // },
    sapper.middleware({
      session: async (req) => {
        let user = null;
        if (req.session && req.session.token) {
          try {
            user = await verify(req.session.token);
          } catch (error) {
            console.log("toutou", req.session);
            if (error.name === "TokenExpiredError") {
              const {
                data: { token },
              } = await client.post("/auth/token", {
                refreshToken: req.session.refreshToken,
              });
              req.session.token = token;
              user = await verify(req.session.token);
            }
          }
        }
        return {
          user,
          token: req.session?.token,
          refreshToken: req.session?.refreshToken,
        };
      },
    })
  )
  .listen(PORT, (err) => {
    if (err) console.log("error", err);
  });
