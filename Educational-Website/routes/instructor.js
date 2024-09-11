const express = require("express");

const router = express.Router();

const instructorControllers = require("../controllers/instructor");

router.get("/add-course", instructorControllers.getAddProduct);

router.post("/add-course", instructorControllers.postAddProduct);

router.get("/instructor-course", instructorControllers.getInstructorCourse);

router.get("/update-course/:courseId", instructorControllers.getUpdate);

router.post("/update-course", instructorControllers.postUpdateProduct);

router.post("/delete-course/:courseId", instructorControllers.DeleteCourse);

module.exports = router;
