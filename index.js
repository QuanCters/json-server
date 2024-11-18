const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({ static: false });

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

server.use((req, res, next) => {
  if (req.method === "GET" && req.query.access_token !== undefined) {
    // Modify the query to exclude objects without 'hobby'
    req.query.hobby = req.query.hobby;
  }
  next();
});

server.use(router);

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
