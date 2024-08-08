import express from "express";
import {
  registerUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  loginUser,
} from "../controllers/UserController.js"
import { authenticatedToken } from "../midleware/verifyToken.js";

const router = express.Router();

router.route("/create-user").post(registerUser);
router.route("/login").post(loginUser);
router.route("/get-user").get(authenticatedToken ,getUser);
router.route("/delete").delete(authenticatedToken ,deleteUser);
router.route("/update").put(authenticatedToken ,updateUser);
router.route("/users/all").get(authenticatedToken, getAllUsers);

export default router;