const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const check = jwt.verify(token,"qwertyuiop");
        console.log(check);
        if(check.userType==="admin"){
            next();
        }
        else{
            return res.status(401).json({
                message:"You are not an admin"
            })
        }


    } catch (error) {
        
    }
}