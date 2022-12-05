const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const check = jwt.verify(token,"qwertyuiop");
        console.log(check.userType);
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

//Access
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg2MjJlZTlhNmFlOTI2NWI3OTk3ZTYiLCJ1c2VybmFtZSI6InVtYW5nMTkwMDAiLCJ1c2VyVHlwZSI6ImFkbWluIiwiaWF0IjoxNjY5OTA1NTQzLCJleHAiOjE2Njk5MDkxNDN9.XRzRk30pA_CvpLljxQMyvh-fhMKDdaNDVR7X_S3uCsI

// refresh
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mzg2MjJlZTlhNmFlOTI2NWI3OTk3ZTYiLCJ1c2VybmFtZSI6InVtYW5nMTkwMDAiLCJ1c2VyVHlwZSI6ImFkbWluIiwiaWF0IjoxNjY5OTA1NTQzLCJleHAiOjE2NzA1MTAzNDN9.CABHq3VgEvnV4A_wHwafJvPTESQ7BRNvypf2PPCHyBw