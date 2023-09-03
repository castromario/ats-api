import { StatusCodes } from "http-status-codes";
import moment from "moment";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Tran from "../models/Tran.js";
import User from "../models/User.js";
import Job from "../models/Job.js";

import checkPermissions from "../utils/checkPermissions.js";

const createTran = async (req, res) => {
  const { jobId, userId } = req.body;
  const userAlreadyExists = await Tran.findOne({ jobId, userId });
  if (userAlreadyExists) {
    throw new BadRequestError("Applicant already applied");
  }
  const tran = new Tran(req.body);
  await tran.save();

  return res
    .status(201)
    .json({ message: "Application successfully", fileId: tran._id });
};

const getAllTran = async (req, res) => {
  const { jobId, userId, sort, status } = req.query;

  const queryObject = {
    // createdBy: req.user.userId,
  };
  // add stuff based on condition

  if (userId && userId !== "all") {
    queryObject.userId = userId;
  }
  if (jobId && jobId !== "all") {
    queryObject.jobId = jobId;
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }

  // NO AWAIT

  let result = Tran.find(queryObject);

  // chain sort conditions

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("jobId");
  }
  if (sort === "z-a") {
    result = result.sort("-jobId");
  }
  if (sort === "a-z") {
    result = result.sort("userId");
  }
  if (sort === "z-a") {
    result = result.sort("-userId");
  }

  //

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tran = await result;

  const totaltran = await Tran.countDocuments(queryObject);
  const numOfPages = Math.ceil(totaltran / limit);

  res.status(StatusCodes.OK).json({ tran, totaltran, numOfPages });
};

const getTranById = async (req, res) => {
  const TranById = await Tran.findOne({ _id: req.params.id });

  const UserId = await User.findOne({ _id: TranById.userId });

  const JobId = await Job.findOne({ _id: TranById.jobId });

  res.status(StatusCodes.OK).json({ TranById, UserId, JobId });
};
const updateTran = async (req, res) => {
  const updateBody = req.body;
  const tran = await Tran.findOne({ _id: req.params.id });

  if (!tran) {
    throw new NotFoundError(`No Transaction with id :${req.params.id}`);
  }
  // check permissions

  //checkPermissions(req.user, job.createdBy);

  await Tran.findByIdAndUpdate(req.params.id, updateBody);
  const updatedTran = await Tran.findOne({ _id: req.params.id });

  res.status(StatusCodes.OK).json({ updatedTran });
};
const deleteTran = async (req, res) => {
  const tran = await Tran.findOne({ _id: req.params.id });

  if (!tran) {
    throw new NotFoundError(`No Transaction with id :${req.params.id}`);
  }

  await Tran.findByIdAndRemove(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ msg: "Success! Application removed", Tran: req.params.id });
};

export { createTran, deleteTran, getAllTran, updateTran, getTranById };
