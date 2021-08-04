const Assessment = require("../Models/Assessment");
const MCQ = require("../Models/MCQ");
const User = require("../Models/User");

// @desc  Home page of Admin
// @route GET /home
// @access Protected

module.exports.get_home = async (req, res, next) => {
  const assessments = await Assessment.find({});
  const mcqs = await MCQ.find({});
  const creators = await User.find({ role: "contentCreator" });
  if (req.query && req.query.success) res.locals.success = req.query.success;
  if (req.query && req.query.err) res.locals.err = req.query.err;
  res.render("AdminDashBoard", { assessments, mcqs, creators });
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
        res.redirect("/admin/home?success=" + success);
      } else {
        let error = "MCQ Could Not Be Created At the Moment";
        res.redirect("/admin/home?err=" + error);
      }
    } catch (err) {
      res.redirect("/admin/home?err=" + err);
    }
  }
};

//@desc allows access to edit mcq form
//@route GET /editmcq
//@access Admin
module.exports.edit_mcq_get = async (req, res, next) => {
  const formData = req.query;
  const mcq_id = formData.mcq_id.trim();
  try {
    MCQ.findById(mcq_id, (err, mcq) => {
      if (err) {
        console.log("Error in editing mcq" + err);
        res.redirect(
          "/admin/home?err=Cannot Edit MCQ at the Moment.Try Later."
        );
      } else {
        res.render("EditMcqForm", { mcq });
      }
    });
  } catch (err) {
    res.redirect("/admin/home?err=Cannot Edit MCQ at the Moment.Try Later.");
  }
};

//@desc edits assessment and saves modified doc
//@route POST /editassessment
//@access Protected

module.exports.edit_mcq_post = (req, res, next) => {
  const formData = req.body;
  const mcq_id = formData.mcq_id.trim();

  let mcq = {
    question: formData.question,
    options: {
      optionOne: formData.optionOne,
      optionTwo: formData.optionTwo,
      optionThree: formData.optionThree,
      optionFour: formData.optionFour,
    },
    answer: formData.answer,
  };
  const isNotEmpty = Object.values(mcq).every((el) => el != null);
  if (isNotEmpty) {
    try {
      MCQ.findByIdAndUpdate(mcq_id, mcq, (err, doc) => {
        if (err) {
          console.log("error in edit mcq " + err);
          res.redirect("/admin/editmcq?err=Cannot edit MCQ.Try Again Later.");
        } else {
          console.log("Document Edited! " + doc);
          res.redirect("/admin/home?success=MCQ Modified Successfully!");
        }
      });
    } catch (err) {
      console.log("error in  mcq edit " + err);
      res.redirect("/admin/editmcq?err=Cannot edit MCQ.Try Again Later.");
    }
  } else {
    console.log(mcq);
    res.redirect("/admin/editmcq?err=Cannot edit MCQ without necessary fields");
  }
};

//@desc deletes the mcq
//@route GET /deletemcq
//@access Protected

module.exports.delete_mcq_get = (req, res, next) => {
  const formData = req.query;
  const mcq_id = formData.mcq_id.trim();
  console.log(mcq_id);

  try {
    MCQ.findByIdAndDelete(mcq_id, (err, doc) => {
      if (err) {
        console.log("Error in deleting MCQ" + err);
        res.redirect(
          "/admin/home?err=Cannot Delete MCQ at the Moment.Try Later."
        );
      } else {
        console.log("Deleted " + doc);
        res.redirect("/admin/home?success=Deleted MCQ Successfully!");
      }
    });
  } catch (err) {
    console.log("Error in deleteing MCQ" + err);
    res.redirect("/admin/home?err=Cannot Edit MCQ at the Moment.Try Later.");
  }
};

//@desc allows access to edit assessment form
//@route GET /editassessment
//@access Protected
module.exports.edit_assessment_get = async (req, res, next) => {
  const formData = req.query;
  const assess_id = formData.assess_id.trim();
  try {
    Assessment.findById(assess_id, (err, assessment) => {
      if (err) {
        console.log("Error in editing assessment" + err);
        res.redirect(
          "/admin/home?err=Cannot Edit Assessment at the Moment.Try Later."
        );
      } else {
        res.render("EditAssessmentForm", { assessment });
      }
    });
  } catch (err) {
    res.redirect(
      "/admin/home?err=Cannot Edit Assessment at the Moment.Try Later."
    );
  }
};

//@desc edits assessment and saves modified doc
//@route POST /editassessment
//@access Protected

module.exports.edit_assessment_post = (req, res, next) => {
  const formData = req.body;
  const assess_id = formData.assess_id.trim();
  const assess_name = formData.assess_name;
  const numberQns = formData.numberQns;
  if (assess_name != null && numberQns != null) {
    try {
      Assessment.findByIdAndUpdate(
        assess_id,
        { assess_name: assess_name, numberQns: numberQns },
        (err, doc) => {
          if (err) {
            console.log("error in edit assessment " + err);
            res.redirect(
              "/admin/editassessment?err=Cannot edit Assessment.Try Again Later."
            );
          } else {
            console.log("Document Edited! " + doc);
            res.redirect(
              "/admin/home?success=Assessment Modified Successfully!"
            );
          }
        }
      );
    } catch (err) {
      console.log("error in edit assessment " + err);
      res.redirect(
        "/admin/editassessment?err=Cannot edit Assessment.Try Again Later."
      );
    }
  } else {
    console.log(assess_name, numberQns);
    res.redirect(
      "/admin/editassessment?err=Cannot edit Assessment without necessary fields"
    );
  }
};

//@desc deletes the assessment
//@route GET /deleteassessment
//@access Protected

module.exports.delete_assessment_get = (req, res, next) => {
  const formData = req.query;
  const assess_id = formData.assess_id.trim();
  console.log(assess_id);

  try {
    Assessment.findByIdAndDelete(assess_id, (err, doc) => {
      if (err) {
        console.log("Error in deleteing Assessment" + err);
        res.redirect(
          "/admin/home?err=Cannot Delete Assessment at the Moment.Try Later."
        );
      } else {
        console.log("Deleted " + doc);
        res.redirect("/admin/home?success=Deleted Assessment Successfully!");
      }
    });
  } catch (err) {
    console.log("Error in deleteing Assessment" + err);
    res.redirect(
      "/admin/home?err=Cannot Edit Assessment at the Moment.Try Later."
    );
  }
};

// @desc  provides form for create assessment
// @route  GET /createassessment
// @access Protected

module.exports.create_assessment_get = (req, res, next) => {
  if (req.query && req.query.success) res.locals.success = req.query.success;
  if (req.query && req.query.err) res.locals.err = req.query.err;
  res.render("AdminAssessmentForm");
};

//@desc creates User from form data
//@route POST /createassessment
//@access Protected

module.exports.create_assessment_post = async (req, res, next) => {
  const data = req.body;

  try {
    const new_Assessment = await Assessment.create(data);
    if (new_Assessment != null) {
      let success = "Assessment Created Successfully!";
      res.redirect("/admin/home?success=" + success);
    } else {
      let error = "Assessment Cannot be Created at the Moment!";
      res.redirect("/admin/createAssessment?err=" + error);
    }
  } catch (err) {
    res.redirect("/admin/createAssessment?err=" + err);
  }
};

//@desc gets content creator form
//@route GET /createcreator
//@access Protected

module.exports.create_creator_get = (req, res, next) => {
  res.render("CreatorForm");
};

//@desc handles form for creating creator
//@route POST /createcreator
//@access Protected

module.exports.create_creator_post = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password, role: "contentCreator" }); //creating and saving user to db
    if (user != null)
      res.redirect("/admin/home?success=Creator created and saved!");
    else res.redirect("/admin/home?err=User cannot be created");
  } catch (err) {
    res.redirect("/admin/home?err=" + err);
  }
};

//@desc deletes content creator
//@route GET /deletecreator
//@access Protected

module.exports.delete_creator_get = (req, res, next) => {
  const formData = req.query;
  const userId = formData.creator_id;
  try {
    User.findByIdAndDelete(userId, (err, doc) => {
      if (err) {
        console.log(err);
        res.redirect("/admin/home?err=" + err);
      } else {
        console.log("User deleted" + doc);
        res.redirect("/admin/home?success=Creator Deleted!");
      }
    });
  } catch (err) {
    res.redirect("/admin/home?err=" + err);
  }
};
