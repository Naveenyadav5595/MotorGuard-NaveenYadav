import Log from "../models/logModel.js";

export const getlogController =async (req,res)=>{
    try {
          const alllog= await Log.find({}).sort({ createdAt: -1 });
          if(alllog.length===0){
            return res.status(404).json({
                message:"No log found"
            })
          }
          return res.status(200).json({
            message:"All logs fetched successfully",
            alllog
          })
    } catch(err){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}