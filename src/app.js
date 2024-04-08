const path = require("path");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");

// const router = require("./router.js");
const socketSetup = require("./io.js");

const port = process.env.PORT || process.env.NODE_PORT || 3001;

const app = express();

// app.use("/assets", express.static(path.resolve(`${__dirname}/../hosted/`)));

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// router(app);
const server = socketSetup(app);

server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
