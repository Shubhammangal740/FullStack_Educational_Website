const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { use } = require("../routes/user");
const router = require("../routes/user");

exports.getUserSignup = (req, res, next) => {
  res.render("normalSignup", {
    pageTitle: "User Signup",
    path: "/user-signup",
  });
};

exports.getLogin = (req, res, next) => {
  res.render("Login", {
    pageTitle: "Login Page",
    path: "/login",
  });
};

exports.getInstructorSignup = (req, res, next) => {
  res.render("instructorSignup", {
    pageTitle: "Instructor Signup Page",
    path: "/instructo-signup",
  });
};

exports.postUserSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/login");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postInstructorSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  const role = req.body.role;
  const bio = req.body.bio;
  const image = req.files;

  if (!image || !image.instructorImage || image.instructorImage.length === 0) {
    throw new Error("Image Not Found");
  }

  console.log(image);
  const imageUrl = image.instructorImage[0].path;
  console.log(imageUrl);
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phone,
        role: role,
        bio: bio,
        imageUrl: imageUrl,
      });
      user
        .save()
        .then((result) => {
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("User not Found!");
      }
      bcrypt
        .compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            console.log("Please enter a valid Password");
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
