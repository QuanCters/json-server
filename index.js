const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({ static: false });

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

server.get("/:collection", (req, res) => {
  const { collection } = req.params;
  const accessToken = req.query.access_token;

  // Ensure the requested collection exists in the database
  if (!router.db.has(collection).value()) {
    return res
      .status(404)
      .json({ error: `Collection "${collection}" not found.` });
  }

  // If access_token is provided, filter the collection
  if (accessToken) {
    const data = router.db
      .get(collection)
      .find({ access_token: accessToken })
      .value();
    if (data) {
      return res.json(data); // Respond with the matching data
    } else {
      return res
        .status(404)
        .json({ error: "No entry found with the provided access token." });
    }
  }

  // If no access_token is provided, return the entire collection
  const collectionData = router.db.get(collection).value();
  res.json(collectionData);
});

server.use(router);

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
