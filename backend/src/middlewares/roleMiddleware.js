
export const roleMiddleware= (req,res,next)=>{
    if(req.user.role!="manager"){
        return res.status(403).json({
            "message":"You are not authorized to perform this action"
        });
    }
    next();
}