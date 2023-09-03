import mongoose from "mongoose";

const TranSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: [true, "Please provide jobId"],
      maxlength: 500,
    },
    userId: {
      type: String,
      required: [true, "Please provide userId"],
      maxlength: 100,
    },
    expectedSalary: {
      type: String,
      default: "0",
      maxlength: 100,
    },

    status: {
      type: String,
      enum: [
        "For CV Review",
        "Line-Up",
        "Short Listed",
        "Interviewed",
        "Selected",
        "Declined",
        "Failed",
        "On Process",
        "Deployed",
        "For Reference",
        "Comments",
        "Inactive",
      ],
      default: "For CV Review",
    },
    threads: [
      {
        description: String,
        status: String,
        date: String,
      },
    ],
  },

  { timestamps: true }
);

export default mongoose.model("Tran", TranSchema);
