const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const User = require("./models/user");
const isAuth = require("./middleware/is-auth");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MONGO_URL = "";

const app = express();

// const fileStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images");
//   },

//   filename: function (req, file, cb) {
//     const uniqueSuffix = uuidv4();
//     const extension = path.extname(file.originalname);
//     cb(null, uniqueSuffix + extension);
//   },
// });

const courseStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/course-images/"); // Path for course images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const instructorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/instructor-images/"); // Path for instructor images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "courseImage") {
      cb(null, "uploads/course-images/");
    } else if (file.fieldname === "instructorImage") {
      cb(null, "uploads/instructor-images/");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const userRoutes = require("./routes/user");
const instructorRoutes = require("./routes/instructor");
const pageRoutes = require("./routes/page");
const errorControllers = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: storage }).fields([
    { name: "courseImage", maxCount: 1 },
    { name: "instructorImage", maxCount: 1 },
  ])
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      res.locals.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(pageRoutes);
app.use(userRoutes);
app.use(instructorRoutes);

app.use(errorControllers.get404);

mongoose
  .connect(MONGO_URL)
  .then((result) => {
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
