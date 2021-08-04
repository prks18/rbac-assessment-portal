const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  assess_name: {
    type: String,
    required: [true, "Please enter name of Assessment"],
    unique: [true, "This Assessment already exists"],
  },
  numberQns: {
    type: Number,
    required: [true, "Please enter number of Questions"],
  },
});

assessmentSchema.post("save", function (doc, next) {
  console.log("Assessment created and saved!", doc);
  next();
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
