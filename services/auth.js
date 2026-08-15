const jwt=require("jsonwebtoken");

function generateToken(userId){
    return jwt.sign({ userId: userId },process.env.JWT_SECRET,{expiresIn:"1d"});
}

function verifyToken(token){
    return jwt.verify(token,process.env.JWT_SECRET);
}

module.exports={
    generateToken,
    verifyToken
}