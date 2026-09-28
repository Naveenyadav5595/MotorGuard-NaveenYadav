import {Router} from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {getAlertController} from "../controllers/alertController.js";
import {getAllAlertsController} from "../controllers/alertController.js";
import {acknowledgeController} from "../controllers/alertController.js";
import {deleteController} from "../controllers/alertController.js";

const router= Router();

router.route("/:motorId")
.get(authMiddleware,getAlertController);

router.route("/")
.get(authMiddleware,getAllAlertsController);

router.route("/:alertId/acknowledge")
.patch(authMiddleware,acknowledgeController)

router.route("/:alertId/delete")
.delete(authMiddleware,deleteController);

export default router;