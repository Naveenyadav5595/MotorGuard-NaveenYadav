import Sensor from "../models/sensorReadingModel.js";
import Motor from "../models/motorModel.js";
import Alert from "../models/alertModel.js";

export const sensorReadingController = async (req,res)=>{
   try{
    // extracting data from req body
    const { motorId,deviceId, temperature,rpm,vibration,timestamp }=req.body;
    const motor=await Motor.findOne({motorId});
    if(!motor){
      return res.status(404).json(
        {
          message:"Motor with Id does not exist"
        }
      );
    }
    // verify motor device id with data sent device id
    if(motor.deviceId!==deviceId){
        return res.status(400).json(
        {
          message:"mismatch in device id"
        }
      );
    }
    const tempWarning=motor.temperatureThreshold.warning;
    const tempCritical=motor.temperatureThreshold.critical;
    const vibWarning=motor.vibrationThreshold.warning;
    const vibCritical=motor.vibrationThreshold.critical;
    const rpmMin=motor.rpmThreshold.min;
    const rpmMax=motor.rpmThreshold.max;
   
    if(temperature>=tempCritical || vibration>=vibCritical || rpm<= rpmMin){
        motor.status="Critical";
    }
    else if(temperature<tempWarning && vibration<vibWarning && rpm> rpmMin && rpm<rpmMax ) {
        motor.status="Healthy";
    }
    else  {
        motor.status="Warning";
    } 

    const newSensorReading= new Sensor(
        {
          motorId,deviceId, temperature,rpm,vibration,timestamp 
        }
    )
    if (rpm > 0) { motor.powerState = "ON"; }
    else if (rpm === 0) {  motor.powerState = "OFF"; }
    await motor.save();
  
    const io = req.app.get("io");
    //alert logic
    if(motor.status!=="Healthy"){
        let message =[];

        if (temperature >= tempCritical) {  message.push(`Motor temperature is ${temperature}°C, which has exceeded the critical threshold of ${tempCritical}°C`); }
        else if (temperature >= tempWarning) { message.push(`Motor temperature is ${temperature}°C, which has exceeded the warning threshold of ${tempWarning}°C`);}
        if (vibration >= vibCritical) { message.push(`Motor vibration is ${vibration}, which has exceeded the critical threshold of ${vibCritical}`); }
        else if (vibration >= vibWarning) { message.push(`Motor vibration is ${vibration}, which has exceeded the warning threshold of ${vibWarning}`); }
        if (rpm < rpmMin) { message.push(`Motor RPM is ${rpm}, which is below the minimum allowed RPM of ${rpmMin}`);}
        if (rpm > rpmMax) { message.push(`Motor RPM is ${rpm}, which has exceeded the maximum allowed RPM of ${rpmMax}`);}
        
        const newAlert= new Alert ({
            motorId,deviceId,severity:motor.status,message
        });
        await newAlert.save();

        // Send newly created alert to all connected clients
        io.emit("newAlert", newAlert);
    }
    await newSensorReading.save();
    
    io.emit("sensorUpdate", {
        motorId: newSensorReading.motorId,
        deviceId: newSensorReading.deviceId,
        temperature: newSensorReading.temperature,
        rpm: newSensorReading.rpm,
        vibration: newSensorReading.vibration,
        timestamp: newSensorReading.timestamp,
        status: motor.status
     });
    if(motor.status=="Critical" && motor.autoShutdownEnabled){
        motor.powerState = "OFF";
        await motor.save();
        return res.status(201).json(
            {
                message:"Sensor reading added successfully",
                motorId,
                command:"TURN_OFF"
            }
        )
    }
    return res.status(201).json(
        {
            message:"Sensor reading added successfully",
            newSensorReading
        }
    );
 }catch(err){
     console.log(err);
    return res.status(500).json(
        {
            message:"Internal server error"
        }
    );
 }
};

// // getting latest redaing of a motor
// export const getLatestReadingController= async (req,res)=>{
//     try{
//         const {motorId}=req.params;
//         const latestReading = await Sensor.findOne({ motorId }).sort({ timestamp: -1 });
//         if (!latestReading) {
//             return res.status(404).json({
//                 message: "No sensor readings found for this motor"
//             });
//         }
//         return res.status(200).json({
//             message: "Latest sensor reading fetched successfully",
//             latestReading
//         });
    
//     } catch(err){
//         return res.status(500).json(
//             {
//               message:"Internal server error"
//             }
//         );
//     }
// };

// getting all reading of motor
export const getAllReadingController= async (req,res)=>{
    try{
        const {motorId}=req.params;
        const allReading = await Sensor.find({ motorId }).sort({ timestamp: 1 }); // sorting oldest-->new
        if (allReading.length===0) {
            return res.status(404).json({
                message: "No sensor readings found for this motor"
            });
        }
        return res.status(200).json({
            message: "all sensor readings for this motor fetched successfully",
            allReading
        });
    
    } catch(err){
         console.error("Get readings error:", err);
        return res.status(500).json(
            {
              message:"Internal server error"
            }
        );
    }
}