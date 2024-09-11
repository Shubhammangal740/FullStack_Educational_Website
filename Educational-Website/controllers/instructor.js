const fileHelper = require("../util/file");
const Course = require("../models/courses");
const User = require("../models/user");
exports.getAddProduct = (req, res, next) => {
  res.render("instructor/addCourse", {
    pageTitle: "instructor Add Course Page",
    path: "/instuctor/add-course",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const duration = req.body.duration;
  const level = req.body.level;
  const image = req.files;

  if (!image || !image.courseImage || image.courseImage.length === 0) {
    throw new Error("Image Not Found");
  }

  const imageUrl = image.courseImage[0].path;

  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error("User does Not Found!");
      }
      const course = new Course({
        title: title,
        description: description,
        duration: duration,
        instructor: req.user.name,
        level: level,
        imageUrl: imageUrl,
        userId: req.user._id,
      });
      course
        .save()
        .then((result) => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getInstructorCourse = (req, res, next) => {
  Course.find({ userId: req.user._id })
    .then((courses) => {
      res.render("instructor/courseListing", {
        courses: courses,
        pageTitle: "instructor Courses Page",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUpdate = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const courseId = req.params.courseId;

  Course.findById(courseId)
    .then((course) => {
      res.render("instructor/addCourse", {
        pageTitle: "instructor Add Course Page",
        path: "/instuctor/add-course",
        editing: editMode,
        course: course,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postUpdateProduct = (req, res, next) => {
  const courseId = req.body.courseId;
  const updatedTitle = req.body.title;
  const updatedDesc = req.body.description;
  const updatedDuration = req.body.duration;
  const updatedLevel = req.body.level;
  const updatedImage = req.files;

  if (
    !updatedImage ||
    !updatedImage.courseImage ||
    updatedImage.courseImage.length === 0
  ) {
    throw new Error("Image Not Found");
  }

  const updatedImageUrl = updatedImage.courseImage[0].path;

  Course.findById(courseId)
    .then((course) => {
      course.title = updatedTitle;
      course.description = updatedDesc;
      course.duration = updatedDuration;
      course.level = updatedLevel;
      if (updatedImage) {
        fileHelper.deleteFile(course.imageUrl);
        course.imageUrl = updatedImageUrl;
      }

      return course
        .save()
        .then((result) => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.DeleteCourse = (req, res, next) => {
  const courseId = req.params.courseId;

  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        throw new Error("Course Not Found!");
      }

      fileHelper.deleteFile(course.imageUrl);
      return Course.findByIdAndDelete({ _id: courseId, userId: req.user._id });
    })
    .then((result) => {
      console.log("Course Deleted!");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};


