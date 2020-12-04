import * as uuid from "uuid";

let data = [
  {
    uuid: "19a87281-6d59-4fe3-bddb-34176e849b69",
    title: "google",
    logo: "https://www.google.com/favicon.ico",
    plugin: "iframe",
    props: {
      src: "https://www.google.com",
      frameBypass: true,
    },
  },
  {
    uuid: "b3658c5a-07e3-47fa-b8a7-8dafd30372a5",
    title: "netflix",
    logo: "https://www.netflix.com/favicon.ico",
    plugin: "iframe",
    props: {
      src: "https://www.netflix.com",
      frameBypass: true,
    },
  },
];

export async function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  if (req.query.uuid) {
    res.end(JSON.stringify(data.filter((b) => b.uuid === req.query.uuid)));
    return;
  }
  res.end(JSON.stringify(data));
}

export async function post(req, res) {
  const bookmarks = [].concat(req.body);
  data = data.concat(
    bookmarks.map((b) => {
      b.uuid = uuid.v4();
      return b;
    })
  );
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(data));
  return;
}

export async function put(req, res) {
  const bookmark = req.body;
  const index = data.findIndex((b) => b.uuid === bookmark.uuid);
  data.splice(index, 1, bookmark);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(data));
  return;
}

export async function del(req, res) {
  if (!req.query.uuid) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    return res.end();
  }

  data = data.filter((b) => b.uuid !== req.query.uuid);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(data));
  return;
}
