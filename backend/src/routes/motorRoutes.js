import {Router} from "express";
const router=Router();

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import {motorCreateController} from "../controllers/motorController.js";
import {allMotorsGetController} from "../controllers/motorController.js";
import {motorGetController} from "../controllers/motorController.js";
import {updateMotorController} from "../controllers/motorController.js";
import {deleteMotorController} from "../controllers/motorController.js";
import {turnOffController} from "../controllers/motorController.js";
import {turnOnController} from "../controllers/motorController.js";


router.route("/")
.post(authMiddleware,roleMiddleware,motorCreateController)
.get(authMiddleware,allMotorsGetController)

router.route("/:motorId")
.get(authMiddleware,motorGetController)
.put(authMiddleware,roleMiddleware,updateMotorController)
.delete(authMiddleware,roleMiddleware,deleteMotorController)

router.route("/:motorId/turnOff")
.patch(authMiddleware,turnOffController);

router.route("/:motorId/turnOn")
.patch(authMiddleware,turnOnController);


export default router;

