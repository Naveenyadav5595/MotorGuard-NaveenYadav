import mongoose, {Schema} from "mongoose";
const logSchema = new Schema (
    {
        userId:{
            type:String,
            required:true
        },
        userName:{
            type:String,
            required:true
        },
        action:{
            type:String,
            required:true,
            enum:["Motor_Created","Motor_Updated","Motor_Deleted","Motor_TurnedOn","Motor_TurnedOff","Alert_Acknowledged","Alert_Deleted"]
        },
        motorId:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Log= mongoose.model("Log",logSchema);
 export  default Log;
