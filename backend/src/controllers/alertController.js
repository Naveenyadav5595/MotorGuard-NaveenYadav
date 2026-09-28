import Alert from "../models/alertModel.js";
import Log from "../models/logModel.js";
import User from "../models/userModel.js";

export const getAlertController= async (req,res)=>{
     const {motorId}=req.params;
     const allAlerts= await Alert.find({motorId});
     if(allAlerts.length===0){
         return res.status(404).json(
            {message:"No Alerts for This motor"}
         )
     }
     return res.status(200).json(
        {
            message:"Alerts Fetched Successfully",
            allAlerts
        }
     )
};

export const getAllAlertsController= async (req,res)=>{
     const allAlerts= await Alert.find();
     if(allAlerts.length===0){
         return res.status(404).json(
            {message:"No Alerts Found!"}
         )
     }
     return res.status(200).json(
        {
            message:"Alerts Fetched Successfully",
            allAlerts
        }
     )
};

export const acknowledgeController= async (req,res)=>{
  try{
    const {alertId}=req.params;
    const alert=await  Alert.findById(alertId);
    if(!alert){
        return res.status(404).json(
            {message:"No alerts found with this Id"}
        )
    }
    alert.acknowledged=true;
    await alert.save();

    // notify all connected clients
    const io = req.app.get("io");
    io.emit("alertAcknowledged", {
      alertId: alert._id
    });
     
//     console.log("before alert acknowledge")
//     console.log("REQ.USER:", req.user);
//    console.log("USER ID:", req.user?.id);
//    console.log("USERNAME:", req.user?.username);
     // creating alert acknowlwdge log
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
               message: "User not found"
            });
        }
        const newlog= new Log({
          userId:req.user.userId,
          userName:user.username,
          action:"Alert_Acknowledged",
          motorId:alert.motorId,
          description:`alert with ${alertId} was acknowledge by user ${user.username}`
        });
        // console.log("LOG OBJECT:", newlog);
        await newlog.save();

   

    return res.status(200).json({
        message:"alerts acknowledged successfully"
    })
  } catch(err){
        return res.status(500).json({
            message: "Failed to acknowledge alert",
            error: err.message
        });
  }
};

export const deleteController = async (req,res)=>{
    try{
        const {alertId}=req.params;
        const alert = await Alert.findById(alertId);

        if (!alert) {
         return res.status(404).json({
            message: "No alert found with this Id",
         });
        }

        if (!alert.acknowledged) {
          return res.status(400).json({
             message: "Alert must be acknowledged before deletion",
          });
        }
        await Alert.findByIdAndDelete(alertId);

        const io = req.app.get("io");
        io.emit("alertDeleted", {
            alertId
        });

         // creating alert deleting log
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
               message: "User not found"
            });
        }
        const newlog= new Log({
          userId:req.user.userId,
          userName:user.username,
          action:"Alert_Deleted",
          motorId:alert.motorId,
          description:`alert with ${alertId} was deleted by user ${user.username}`
        });
        await newlog.save();

        return res.status(200).json({
            message: "Alert deleted successfully",
        });

    } catch(err){
         return res.status(500).json({
            message: "Failed to delete alert",
            error: err.message
        });
    }

}