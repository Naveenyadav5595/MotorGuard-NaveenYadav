import mongoose, {Schema} from "mongoose";
const userSchema= new Schema(
     {
        username:{
            type:String,
            required:[true,"username is required"],
            unique:[true,"username must be unique"]
        },
        email:{
            type:String,
            required: [true,"email is required"],
            unique: [true,"email must be unique"],
            lowercase: true,
            trim: true
        },
        password:{
            type:String,
            required:[true,"password is required"]
        },
        role:{
            type:String,
            enum: ["manager", "operator"],
            default:"operator"
        }
     },
     {
        timestamps:true
     }
);

const User=mongoose.model("User",userSchema);
export default User;
