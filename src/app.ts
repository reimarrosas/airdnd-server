if (process.env["NODE_ENV"] !== "production") {
  require("dotenv").config();
}

import express from "express";
require("express-async-errors");
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { redisClient, RedisStore, session } from "./config/session.config";
import { sessionSecret, port, cookieSettings } from "./utilities/constants";
import { error, notFound } from "./controllers/error.controller";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: sessionSecret,
    resave: false,
    name: "dnd_sid",
    cookie: cookieSettings,
  })
);

app.get("/", (_req, res) => {
  const message: HttpResponseMessage = {
    message: "Hello, World!",
    success: true,
  };

  res.send({
    message,
  });
});

app.use(notFound);
app.use(error);

app.listen(port, () => console.log(`Listening at PORT ${port}`));
