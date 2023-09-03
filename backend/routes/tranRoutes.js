import express from "express";
const router = express.Router();

import {
  createTran,
  deleteTran,
  getAllTran,
  updateTran,
  getTranById,
} from "../controllers/tranController.js";

import testUser from "../middleware/testUser.js";

router.route("/search").get(getAllTran);
router.route("/new").post(createTran);
router.route("/byId/:id").delete(deleteTran).patch(updateTran).get(getTranById);

export default router;
