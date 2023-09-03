import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "Manila",
  },
  accountType: {
    type: String,
    default: "applicant",
  },
  skills: [String],
  middleName: String,
  dateOfBirth: Date,
  age: Number,
  placeOfBirth: String,
  gender: String,
  maritalStatus: String,
  numberOfChildren: Number,
  religion: String,
  presentHomeAddress: String,
  permanentAddress: String,
  motherName: String,
  height: Number,
  fatherName: String,
  weight: Number,
  passport: {
    number: String,
    dateOfIssue: Date,
    dateOfExpiry: Date,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    contactNumber: String,
  },
  educationalBackground: [
    {
      nameOfSchool: String,
      city: String,
      degree: String,
      dateCompleted: Date,
    },
  ],
  employmentHistory: [
    {
      companyCountry: String,
      position: String,
      periodOfEmployment: String,
      employerName: String,
    },
  ],
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
