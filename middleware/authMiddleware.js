const {verifyToken}=require("../services/auth.js");

function authMiddleware(req,res,next){
    try{
        const token=req.cookies.token; //to get the token from the cookie
        if(!token){
            return res.status(401).json({
                message: "Authentication required"
            });
        }
        const decoded=verifyToken(token);
        req.user=decoded.userId;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports={
    authMiddleware
}