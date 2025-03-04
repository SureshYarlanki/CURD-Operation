

const adminAuth = (req, res, next) => {
    const token = "suresh"
    if (token === "suresh") {
        next()
    }
    else {
        res.status(401).send("unauthorized user")
    }
    
}
module.exports= {adminAuth}
