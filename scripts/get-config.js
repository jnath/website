const axios = require("axios");
const fs = require("fs").promises;
const join = require("path").join;

function parse(content) {
  // Remove comments
  var lines = content.split("\n");
  for (var n in lines) {
    var i = lines[n].indexOf("#");
    if (i > -1) lines[n] = lines[n].substring(0, i);
  }
  content = lines.join("\n");

  var tokens = content.split(/[ \t\n\r]+/);
  var machines = {};
  var m = null;
  var key = null;

  // if first index in array is empty string, strip it off (happens when first line of file is comment. Breaks the parsing)
  if (tokens[0] === "") tokens.shift();

  for (var i = 0, key, value; i < tokens.length; i += 2) {
    key = tokens[i];
    value = tokens[i + 1];

    // Whitespace
    if (!key || !value) continue;

    // We have a new machine definition
    if (key === "machine") {
      m = {};
      machines[value] = m;
    }
    // key=value
    else {
      m[key] = value;
    }
  }

  return machines;
}

async function getHerokuApiKey() {
  const home =
    process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  if (!home) return {};

  return parse((await fs.readFile(join(home, ".netrc"))).toString());
}

async function getHerokuEnv(options) {
  const apiKeys = await getHerokuApiKey();
  const credentials = apiKeys["api.heroku.com"];

  const response = await axios({
    url: `https://api.heroku.com/apps/${options.app}/config-vars`,
    headers: {
      accept: "application/vnd.heroku+json; version=3",
      authorization: `Basic ${Buffer.from(
        `${credentials.login}:${credentials.password}`
      ).toString("base64")}`,
    },
  });
  return response.data;
}

async function start() {
  try {
    const values = await getHerokuEnv({ app: "jonath-website" });
    const arr = [];
    Object.keys(values).forEach((key) => {
      arr.push(`${key}=${values[key]}`);
    });
    fs.writeFile(join(process.cwd(), "./.env"), arr.join("\n"));
  } catch (error) {
    console.error(error);
  }
}

start();
