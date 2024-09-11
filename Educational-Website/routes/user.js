const express = require("express");

const router = express.Router();
const userControllers = require("../controllers/user");

router.get("/user-signup", userControllers.getUserSignup);

router.post("/user-signup", userControllers.postUserSignup);

router.get("/login", userControllers.getLogin);

router.post("/login", userControllers.postLogin);

router.get("/instructor-signup", userControllers.getInstructorSignup);

router.post("/instructor-signup", userControllers.postInstructorSignup);

router.post("/logout", userControllers.postLogout);

module.exports = router;
