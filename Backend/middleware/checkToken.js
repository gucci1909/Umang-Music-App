const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const check = jwt.verify(token,"qwertyuiop");
        if(check){
            next();
        }
        else{
            return res.status(401).json({
                message:"invalid token"
            })
        }
        
    } catch (error) {
        return res.status(401).json({
            message:"invalid token"
        })
    }
}