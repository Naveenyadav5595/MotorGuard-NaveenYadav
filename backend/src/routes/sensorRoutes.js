import {Router} from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router=Router();

import  {sensorReadingController} from "../controllers/sensorController.js";
// import  {getLatestReadingController} from "../controllers/sensorController.js";
import  {getAllReadingController} from "../controllers/sensorController.js";

router.route("/readings")
.post(sensorReadingController);

// router.route("/readings/:motorId/latest")
// .get(authMiddleware,getLatestReadingController)

router.route("/readings/:motorId/all")
.get(authMiddleware,getAllReadingController);







export default router;