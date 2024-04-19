// const path = require('path');
require("dotenv").config();
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const redis = require("redis");
const helmet = require("helmet");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const cors = require("cors");

const router = require("./router.js");
const socketSetup = require("./io.js");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1/Tempie";
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log("Could not connect to the database");
    throw err;
  }
});

const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
redisClient.on("error", (err) => console.log("Redis Client Error: ", err));

redisClient.connect().then(() => {
  const app = express();

  // app.use("/assets", express.static(path.resolve(`${__dirname}/../hosted/`)));

  app.use(cors());
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  const sessionMiddleware = session({
    key: "sessionid",
    store: new RedisStore({
      client: redisClient,
    }),
    secret: "Tempie Bones",
    resave: false,
    saveUninitialized: false,
  });

  app.use(sessionMiddleware);
  router(app);
  const server = socketSetup(app, sessionMiddleware);

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port ${port}`);
  });
});
