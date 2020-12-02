import type { Middleware } from "polka";
import pluginsCollection from "./index";

export function pluginMiddleware() {
  return async (req, res, next) => {
    if (req.path.startsWith("/plugins")) {
      const pluginName = req.path.split("/")[2];
      if (plugins[pluginName]) {
        const plugin = plugins[pluginName];
        return await (await plugin())(req, res, next);
      }
    }
    next();
  };
}

let plugins: {
  [name: string]: () => Middleware;
} = null;

(async () => {
  plugins = await Object.keys(pluginsCollection).reduce(
    async (collection, name) => {
      collection[name] = (await import(`./${name}/index.ts`)).default;
      return collection;
    },
    {}
  );
})();

export default plugins;
