const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please enter a question"],
  },
  options: {
    optionOne: {
      type: String,
      required: true,
    },
    optionTwo: {
      type: String,
      required: true,
    },
    optionThree: {
      type: String,
      required: true,
    },
    optionFour: {
      type: String,
      required: true,
    },
  },
  answer: {
    type: String,
    required: true,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assessment",
    required: [true, "Invalid Assessment ID"],
  },
});

mcqSchema.post("save", function (doc, next) {
  console.log("MCQ created and saved!", doc);
  next();
});

const MCQ = mongoose.model("MCQ", mcqSchema);

module.exports = MCQ;
