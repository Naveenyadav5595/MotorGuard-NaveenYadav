import {Router} from "express";
const router=Router();

import  {userRegisterController} from "../controllers/userController.js";
import  {userLoginController} from "../controllers/userController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {roleMiddleware} from "../middlewares/roleMiddleware.js";


// register route
router.route("/register").post(userRegisterController);
// log in route
router.route("/login").post(userLoginController);




 export default router;