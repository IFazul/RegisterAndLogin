const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/auth");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 2000;
const mongoURI = process.env.MONGO_URI;

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "sessions",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "This is a secret key",
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
})

app.use(authRoutes);
app.use("/",(req,res) => {
    res.render('index');
})

mongoose
  .connect(mongoURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
