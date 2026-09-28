import mongoose,{Schema} from "mongoose";

const alertSchema= new Schema (
    {
      motorId:{
        type:String,
        required:true
      },
      deviceId:{
        type:String,
        required:true
      },
      message:{
        type:[String],
        required:true
      },
      severity:{
        type:String,
        enum:["Warning", "Critical"],
        required:true
      },
      acknowledged:{
        type:Boolean,
       default:false
      },
      timestamp:{
        type: Date,
        default: Date.now
      }
    }
);
const Alert =mongoose.model("Alert", alertSchema);
export default Alert;