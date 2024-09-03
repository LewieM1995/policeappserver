const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
require("dotenv").config();
const { pool1, pool2, pool3 } = require("./database");
const {
  policeAppRouter,
  ringconRouter,
  fujiRouter,
} = require("./routing/routes");

// App
const app = express();
app.use(express.json());

// Middleware
app.options("*", cors());
app.use(
  cors({
    origin: [
      "https://main.d2ua1ewdznhv26.amplifyapp.com",
      "https://main.d2m80lfwl4zikf.amplifyapp.com",
      "http://localhost:3000",
      "http://localhost:4000",
      "https://main.dg5u78k9pgwbk.amplifyapp.com",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

const dbConnection = (pool) => {
  return (req, res, next) => {
    pool.getConnection((error, connection) => {
      if (error) {
        console.error("Error connecting to db", error);
        return res.status(500).json({ error: "Database connection failed" });
      }
      req.dbConnection = connection;
      res.on("finish", () => {
        req.dbConnection.release();
      });
      next();
    });
  };
};

// Routes using pool1
app.use("/policeapp", dbConnection(pool1), policeAppRouter);

// Routes using pool2
app.use("/ringcon", dbConnection(pool2), ringconRouter);

// Routes using pool3
app.use("/fujiseal", dbConnection(pool3), fujiRouter);

/*  const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/chain.pem'),
    }; */

const server = https.createServer(/* options, */ app);

//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));
console.log("Server started successfully");
