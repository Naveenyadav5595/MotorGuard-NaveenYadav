import mongoose, {Schema} from "mongoose";

const sensorReadingSchema= new Schema(
    {
      motorId:{
         type:String,
         required:[true,"Motor Id is required"]
      },
      deviceId:{
        type:String,
        required:[true,"device Id is required"]
      },
      temperature:{
        type:Number,
        required:[true,"temperature is required"]
      },
      rpm:{
        type:Number,
        required:[true,"rpm is required"],
        min: [0, "rpm cannot be negative"]
      },
      vibration:{
        type:Number,
        required:[true,"vibration is required"],
        min: [0, "Vibration cannot be negative"]
      },
      timestamp: {
        type: Date,
        required: [true, "Timestamp is required"]
      }
    },
    {
      timestamps:true
    }
);
const Sensor= mongoose.model("Sensor",sensorReadingSchema);
export default Sensor;