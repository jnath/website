import type { ServerResponse } from "http";

import proxy from "./proxy";

export default () => {
  const handler = proxy({
    basePath: "/plugins/iframe",
    originWhitelist: [], // Allow all origins
    removeHeaders: [
      "x-frame-options",
      "x-frame-options",
      "x-final-url",
      "x-request-url",
    ],
  });
  return (req, res: ServerResponse) => {
    handler(req, res);
  };
};
