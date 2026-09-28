import {Router} from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import  {getlogController} from "../controllers/logController.js";
const router= Router();

router.route("/")
.get(authMiddleware,getlogController);

export default router;