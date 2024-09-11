const Course = require("../models/courses");
const ContactForm = require("../models/contact");
const User = require("../models/user");

exports.getHome = (req, res, next) => {
  Course.find({})
    .then((course) => {
      console.log(course.slice(0, 4));
      res.render("index", {
        pageTitle: "Online Learning Platform",
        siteName: "EduPro",
        courses: course.slice(0, 4),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCorses = (req, res, next) => {
  Course.find()
    .then((course) => {
      res.render("courses", {
        pageTitle: "Responsive Multipage Educational Website",
        siteName: "EduPlatform",
        courses: course,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getContact = (req, res, next) => {
  res.render("contact", {
    pageTitle: "Responsive Multipage Educational Website",
    siteName: "Harsh Tiwari",

    socialLinks: [
      { url: "https://facebook.com", icon: "uil-facebook" },
      { url: "https://twitter.com", icon: "uil-twitter" },
      { url: "https://instagram.com", icon: "uil-instagram" },
      { url: "https://linkedin.com", icon: "uil-linkedin" },
    ],
  });
};

exports.postContactForm = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;

  const contact = new ContactForm({
    firstName: firstName,
    lastName: lastName,
    email: email,
    message: message,
  });
  contact
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAbout = (req, res, next) => {
  User.find({ role: { $ne: "user" } })
    .then((user) => {
      res.render("about", {
        pageTitle: "About Page",
        teamMembers: user,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
