const Assessment = require("../Models/Assessment");
const MCQ = require("../Models/MCQ");
const User = require("../Models/User");
const { getUserIdFromToken } = require("../Controllers/AuthController");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// @desc  Renders home page
// @route  /home
// @access Protected

module.exports.home_get = async (req, res, next) => {
  const assessments = await Assessment.find({});
  if (req.query && req.query.success) res.locals.success = req.query.success;
  if (req.query && req.query.err) res.locals.err = req.query.err;
  res.render("StudentHome", { assessments, err: req.query.err });
};

// @desc  gets mcqs for an assessment
// @route  GET /getmcq
// @access Protected

module.exports.mcq_get = async (req, res, next) => {
  if (req.query === null && req.query.assess_id === null) {
    res.redirect("/student/home?err=Assessment Not Found");
  } else {
    const formData = req.query;
    formData.assess_id = formData.assess_id.trim();
    try {
      const mcqs = await MCQ.find({ assessmentId: formData.assess_id });
      res.render("mcq", { mcqs, assess_id: formData.assess_id });
    } catch (err) {
      res.redirect("/student/home?err=" + err);
    }
  }
};

// @desc  Handles MCQ post processing
// @route POST /postmcq
// @access Protected

module.exports.post_mcq = async (req, res, next) => {
  const formData = req.body;
  let score = 0;

  console.log(formData);

  try {
    //Calculate score by comparing answers
    const mcqs = await MCQ.find({ assessmentId: formData.assess_id });
    mcqs.forEach((mcq, index) => {
      if (mcq.answer === formData[index]) {
        score += 1;
      }
    });
    // Decrypt token and find user to save score to that user
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, "my secret phrase", (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect(
            "/student/home?err=Cannot save your score.Please reattempt the mcq"
          );
        } else {
          const userId = decodedToken.id;
          User.findByIdAndUpdate(
            userId,
            { score: score },
            { new: true },
            function (err, doc) {
              if (err) {
                console.log(err);
              } else {
                console.log("Score saved !" + doc);
                res.redirect(
                  "/student/home?success=Mcq Attended Successfully!"
                );
              }
            }
          );
        }
      });
    } else {
      res.redirect(
        "/student/home?err=Cannot save your score.Please reattempt the mcq"
      );
    }
  } catch (err) {
    res.redirect("/student/home?err=" + err);
  }
};

//@desc gets assessments for student
//@route  GET /getassessment
//@access  Protected

module.exports.assessment_get = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({});
    res.status(201).json(assessments);
  } catch (err) {
    res.status(422).json(err);
  }
};
