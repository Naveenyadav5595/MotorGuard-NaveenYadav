import mongoose, {Schema} from "mongoose";

const motorSchema= new Schema(
    {
      motorId:{
        type:String,
        required:[true,"Motor ID is required"],
        unique:[true, "Motor ID must be unique"]
      },
      motorName:{
        type:String,
        required:[true,"Motor name is required"],
      },
      location:{
        type:String,
        required:[true,"Motor location is required"],
      },
      deviceId:{
        type:String,
        required:[true,"device ID is required"],
        unique:[true, "device ID must be unique"]
      },
      status:{
        type:String,
        enum:["Healthy","Warning","Critical","Offline"],
        default:"Healthy"
      },
      powerState:{
        type:String,
        enum:["ON","OFF"],
        default:"OFF"
      },
      autoShutdownEnabled: {
        type: Boolean,
        default: true
      },
      temperatureThreshold: {
          warning: {
            type: Number,
            required: [true, "Temperature warning threshold is required"]
          },
          critical: {
            type: Number,
            required: [true, "Temperature critical threshold is required"]
          }
       },
       rpmThreshold: {
          min: {
            type: Number,
            required: [true, "Minimum RPM threshold is required"]
          },
          max: {
            type: Number,
            required: [true, "Maximum RPM threshold is required"]
          }
        },
        vibrationThreshold: {
          warning: {
            type: Number,
            required: [true, "Vibration warning threshold is required"]
          },
          critical: {
            type: Number,
            required: [true, "Vibration critical threshold is required"]
          }
        }
    },
    {
        timestamps:true
    }
);

const Motor= mongoose.model("Motor", motorSchema);
export default Motor;