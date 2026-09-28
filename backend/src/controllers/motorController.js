import Motor from "../models/motorModel.js";
import Log from "../models/logModel.js";
import User from "../models/userModel.js"

// create motors
export const motorCreateController= async (req,res)=>{
  try {
    // extracting data
    const {
        motorId,
        motorName,
        location,
        deviceId,
        temperatureThreshold,
        rpmThreshold,
        vibrationThreshold,
        autoShutdownEnabled
    } = req.body;
   // server side validations
   if (
       !motorId ||
       !motorName ||
       !location ||
       !deviceId ||
       !temperatureThreshold ||
       !rpmThreshold ||
       !vibrationThreshold
    ) {
       return res.status(400).json({
           message: "All required motor details are required"
        });
    }
    if (
       temperatureThreshold.warning === undefined ||
       temperatureThreshold.critical === undefined ||
       rpmThreshold.min === undefined ||
       rpmThreshold.max === undefined ||
       vibrationThreshold.warning === undefined ||
       vibrationThreshold.critical === undefined
    ) {
       return res.status(400).json({
           message: "All threshold values are required"
        });
    }

    if ( temperatureThreshold.warning >= temperatureThreshold.critical) {
       return res.status(400).json({
             message: "Temperature warning threshold must be less than critical threshold"
        });
    }

    if ( vibrationThreshold.warning >= vibrationThreshold.critical) {
       return res.status(400).json({
           message: "Vibration warning threshold must be less than critical threshold"
        });
    }

    if (rpmThreshold.min >= rpmThreshold.max) {
        return res.status(400).json({
           message: "Minimum RPM must be less than maximum RPM"
        });
    }
    // check duplicate motor -- by motorid or device id is duplicate
    const existingMotor = await Motor.findOne({
         $or: [{ motorId },{ deviceId }]
    });
    // duplicate found
    if (existingMotor) {
       return res.status(409).json({
           message: "Motor ID or Device ID already exists"
       });
    }
    const newMotor = new Motor({
        motorId,
        motorName,
        location,
        deviceId,
        temperatureThreshold,
        rpmThreshold,
        vibrationThreshold,
        autoShutdownEnabled
    });
    await newMotor.save();

    // creating motor create log
    const newlog= new Log({
          userId:req.user.id,
          userName:req.user.username,
          action:"Motor_Created",
          motorId,
          description:`New Motor with ${motorId} was created by user ${req.user.username}`
    });
    await newlog.save();

    return res.status(201).json({message: "Motor created successfully",motor: newMotor});

  } catch(err){
         console.error("Motor creation error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
  }
};

//get all motors
export const allMotorsGetController= async (req,res)=>{
    try{
     const allMotors= await Motor.find();
     return res.status(200).json({
            message: "Motors fetched successfully",
            allMotors
        });
    } catch(err){
         console.error("Get motors error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
// get single motor
export const motorGetController = async (req,res)=>{
   try{
    const {motorId} = req.params;
    const motor= await Motor.findOne({motorId});
    if(!motor){
         return res.status(404).json({
             "message":"Motor with Id does not exist"
         });
    }
    return res.status(200).json(
        {
            "message":"Motor fetched successfully ",
            motor
        }
    )
  } catch(err){
       console.error("Get motor error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
  }
};

// update motor
export const updateMotorController= async (req,res)=>{
    try {
        const { motorId } = req.params;
        const motor = await Motor.findOne({ motorId });
        if (!motor) {
            return res.status(404).json({
                message: "Motor with Id does not exist"
            });
        }
        const updatedMotor = await Motor.findOneAndUpdate(
            { motorId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        // create new log
        const user = await User.findById(req.user.userId);
       try{
        const newlog= new Log({
          userId:req.user.userId,
          userName:user.username,
          action:"Motor_Updated",
          motorId,
          description:`New Motor with ${motorId} was updated by user ${user.username}`
        });
        await newlog.save();
       }catch(err){
          console.error("Audit log error:", err);
       }

        return res.status(200).json({
            message: "Motor updated successfully",
            motor: updatedMotor
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating motor",
        });
    }
};

// delete motor
export const deleteMotorController= async (req,res)=>{
    try {
        const {motorId}=req.params;
        const deletedMotor=  await Motor.findOneAndDelete({motorId});
        if (!deletedMotor) {
            return res.status(404).json({
                message: "Motor with Id does not exist"
            });
        }

         // create new log
        const user = await User.findById(req.user.userId);
       try{
        const newlog= new Log({
          userId:req.user.userId,
          userName:user.username,
          action:"Motor_Deleted",
          motorId,
          description:`New Motor with ${motorId} was deleted by user ${user.username}`
        });
        await newlog.save();
       }catch(err){
          console.error("Audit log error:", err);
       }

        return res.status(200).json({
              message:"Motor deleted successfully"
        });
    } catch(err){
        return res.status(500).json({
            message: "Error deleting motor",
        });
    }
};

// for turning offf motor
 export const turnOffController =async (req,res)=>{
    try{
      const {motorId}=req.params;
      const motor = await Motor.findOne({motorId});
      if(!motor){
        return res.status(404).json({
            message:"motor with this Id does not exist"
        });
      }
      if(motor.powerState==="OFF"){
          return res.status(200).json({
            message:"motor is already OFF"
        });
      }
      motor.powerState="OFF";
      await motor.save();

      //creating new log
        const user = await User.findById(req.user.userId);
      try{
        const newlog= new Log({
          userId:req.user.userId,
          userName:user.username,
          action:"Motor_TurnedOff",
          motorId,
          description:`New Motor with ${motorId} was turned off by user ${user.username}`
        });
        await newlog.save();
      }catch(err){
        console.error("Audit log error:", err);
      }

      // command will be send to esp32 to trun off motorid motor
    //   const command = {
    //     "motorId": motor.motorId,
    //     "command": "TURN_OFF"
    //   };

      return res.status(200).json(
        {
          message:"motor turned OFF successfully",
          powerState:"OFF"
        }
      )
    }catch(err){
        return res.status(500).json({
            message: "Error turning Off motor",
            powerState:"OFF"
        });
    }
 };

 // for turning on motor
 
 export const turnOnController =async (req,res)=>{
    try{
      const {motorId}=req.params;
      const motor = await Motor.findOne({motorId});
      if(!motor){
        return res.status(404).json({
            message:"motor with this Id does not exist"
        });
      }
      if(motor.powerState==="ON"){
          return res.status(200).json({
            message:"motor is already ON",
            powerState: "ON"
        });
      }
      motor.powerState="ON";
      await motor.save();

      //creating new log
        const user = await User.findById(req.user.userId);
      try{
        const newlog= new Log({
          userId:req.user.userId,
          userName:user.username,
          action:"Motor_TurnedOn",
          motorId,
          description:`New Motor with ${motorId} was turned on by user ${user.username}`
        });
        await newlog.save();
      }catch(err){
        console.error("Audit log error:", err);
      }
   
      // command will be send to esp32 to trun on motorid motor
    //   const command = {
    //     "motorId": motor.motorId,
    //     "command": "TURN_ON"
    //   };

      return res.status(200).json(
        {
          message:"motor turned ON successfully",
          powerState: "ON"
        }
      )
    }catch(err){
        return res.status(500).json({
            message: "Error turning ON motor",
        });
    }
 };