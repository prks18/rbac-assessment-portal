const Assessment = require("../Models/Assessment");
const MCQ = require("../Models/MCQ");

// @desc  HOME page of creator
// @route  GET /home
// @access Protected

module.exports.home_creator = async (req, res, next) => {
  const assessments = await Assessment.find({});

  if (req.query && req.query.success) res.locals.success = req.query.success;
  if (req.query && req.query.err) res.locals.err = req.query.err;
  res.render("CreatorDashBoard", { assessments });
};

// @desc  Displays form for MCQ Question
// @route GET /createmcq
// @access Protected

module.exports.create_mcq_get = async (req, res, next) => {
  const noq = req.query.noq;
  const assess_id = req.query.assess_id;
  const data = { assess_id: assess_id, noq: noq };

  if (req.query && req.query.success) res.locals.success = req.query.success;
  if (req.query && req.query.err) res.locals.err = req.query.err;

  res.render("CreateMcq", { data });
};

// @desc  Handles form for MCQ Question
// @route POST /createmcq
// @access Protected

module.exports.create_mcq_post = async (req, res, next) => {
  let formData = req.body;
  formData.assess_id = formData.assess_id.trim();
  for (let index = 0; index < formData.questions.length; index++) {
    const mcq = {
      question: formData.questions[index],
      options: {
        optionOne: formData.OptionOne[index],
        optionTwo: formData.OptionTwo[index],
        optionThree: formData.OptionThree[index],
        optionFour: formData.OptionFour[index],
      },
      answer: formData.answers[index],
      assessmentId: formData.assess_id,
    };
    try {
      const mcqObj = await MCQ.create(mcq);
      if (mcqObj != null) {
        let success = "MCQ Created Successfully!";
        res.redirect("/creator/home?success=" + success);
      } else {
        let error = "MCQ Could Not Be Created At the Moment";
        res.redirect("/creator/home?err=" + error);
      }
    } catch (err) {
      res.redirect("/creator/home?err=" + err);
    }
  }
};

// @desc  gets form for create assessment
// @route  GET /createassessment
// @access Protected

module.exports.create_assessment_get = (req, res, next) => {
  if (req.query && req.query.success) res.locals.success = req.query.success;
  if (req.query && req.query.err) res.locals.err = req.query.err;
  res.render("CreatorAssessmentForm");
};

//@desc handles form for creating assessment
//@route POST /createassessment
//@access Protected

module.exports.create_assessment_post = async (req, res, next) => {
  const data = req.body;

  try {
    const new_Assessment = await Assessment.create(data);
    if (new_Assessment != null) {
      let success = "Assessment Created Successfully!";
      res.status(201).json(new_Assessment);
      res.redirect("/creator/home?success=" + success);
    } else {
      let error = "Assessment Cannot be Created at the Moment!";
      res.redirect("/creator/createAssessment?err=" + error);
    }
  } catch (err) {
    res.redirect("/creator/createAssessment?err=" + err);
  }
};
