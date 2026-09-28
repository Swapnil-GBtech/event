import { Router } from "express";
import { isAuth } from "../middleware/Auth.middleware.js";
import {
  CreateCategry,
  getAllCategory,
  UpdateCategory,
  deleteCategory,
} from "../controller/Categry.controller.js";
const router = Router();

router.post("/create-category", isAuth, CreateCategry);
router.get("/get-all-category", getAllCategory);
router.put("/update-category", isAuth, UpdateCategory);
router.delete("/delete-category", isAuth, deleteCategory);

export default router;
