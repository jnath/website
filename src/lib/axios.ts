import axios from "axios";
import decode from "jwt-decode";
import { parse } from "cookie";

const client = axios.create();

export function axiosMiddleware() {
  return (req, res, next) => {
    if (req.baseUrl === undefined) {
      let originalUrl = req.originalUrl || req.url;
      if (req.url === "/" && originalUrl[originalUrl.length - 1] !== "/") {
        originalUrl += "/";
      }

      req.baseUrl = originalUrl ? originalUrl.slice(0, -req.url.length) : "";
    }
    const protocol = (req.socket as any).encrypted ? "https" : "http";
    const baseURL = `${protocol}://127.0.0.1:${process.env.PORT}${
      req.baseUrl ? req.baseUrl + "/" : ""
    }`;

    const headers = {
      ...req.headers,
    };

    const cookies = {
      ...parse(req.headers.cookie || ""),
    };

    const set_cookie = res.getHeader("Set-Cookie");
    (Array.isArray(set_cookie) ? set_cookie : [set_cookie]).forEach(
      (s: string) => {
        const m = /([^=]+)=([^;]+)/.exec(s);
        if (m) cookies[m[1]] = m[2];
      }
    );

    const str = Object.keys(cookies)
      .map((key) => `${key}=${cookies[key]}`)
      .join("; ");

    headers.cookie = str;
    delete headers.accept;

    client.defaults.headers = headers;
    client.defaults.baseURL = baseURL;
    client.defaults.withCredentials = true;
    next();
  };
}

export function setRefreshTokenProcess(session, paths: string[]) {
  client.interceptors.response.use(
    (response) => {
      if (paths.includes(new URL(response.request.responseURL).pathname)) {
        session.token = response.data.token;
        session.refreshToken = response.data.refreshToken;
      }
      return response;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  client.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      if (session.refreshToken && session.user.exp <= Date.now() / 1000) {
        const {
          data: { token },
        } = await axios.post("/auth/token", {
          refreshToken: session.refreshToken,
        });
        session.user = decode(token) as any;
        session.token = token;
      }
      return config;
    },
    (error) => {
      // Do something with request errorœ
      return Promise.reject(error);
    }
  );
}

export default client;
