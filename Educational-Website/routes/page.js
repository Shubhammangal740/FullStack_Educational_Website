const express = require("express");

const router = express.Router();

const pageControllers = require("../controllers/page");

router.get("/", pageControllers.getHome);

router.get("/courses", pageControllers.getCorses);

router.get("/contact", pageControllers.getContact);

router.post("/submit-contact", pageControllers.postContactForm);

router.get("/about", pageControllers.getAbout);

module.exports = router;
