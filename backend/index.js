const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" }); //this put the .env data into process
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRouter");
const walletRouter = require("./routes/walletRouter");
const connect = require("./db connection/connection");
const requireUser = require("./middlewares/requireUser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8000;

//app middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.set("trust proxy", 1);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use("/wallet", requireUser, walletRouter);

app.get("/", (req, res) => {
  try {
    res.json("get request");
  } catch (error) {
    res.json(error);
  }
});

// start server only when we have valid connection
connect()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log("server started at", PORT);
      });
    } catch (error) {
      console.log("cannot connect to server");
    }
  })
  .catch((error) => {
    console.log("invalid database connection", error);
  });
