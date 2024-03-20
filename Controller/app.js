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
app.all(/.*\%.*/, (req, res) => {
  res.json({ code: "U1" }); // Or handle unmatched requests differently
});

app.use("/admin", admin);
app.use("/", public);
app.use("/user", user);
app.all("*", (req, res) => {
  res.json({ code: "U1" }); // Or handle unmatched requests differently
});

/** App listening on port */
app.listen(parseInt(process.env.PORT), () => {
  console.log(`TMS listening at http://localhost:${process.env.PORT}`);
});
