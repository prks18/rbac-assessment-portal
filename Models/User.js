const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [7, "Minimum length is 7 characters"],
  },

  role: {
    type: String,
    enum: ["admin", "contentCreator", "student"],
    default: "student",
  },
  score: Number,
});

userSchema.post("save", function (doc, next) {
  console.log("Document created and saved!", doc);
  next();
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const authValid = await bcrypt.compare(password, user.password);
    if (authValid) {
      return user;
    } else {
      throw new Error("Incorrect Username/Password");
    }
  }
  throw new Error("Incorrect Username/Password");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
