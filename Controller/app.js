const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Origin",
      "Accept",
      "x-auth-token",
    ],
  })
);

// Routes
const admin = require("./routes/admin");
const public = require("./routes/public");
const user = require("./routes/user");

// Mount Routes
app.use("/admin", admin);
app.use("/", public);
app.use("/user", user);

/** App listening on port */
app.listen(parseInt(process.env.PORT), () => {
  console.log(`TMS listening at http://localhost:${process.env.PORT}`);
});
