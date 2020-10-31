const data = [
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
