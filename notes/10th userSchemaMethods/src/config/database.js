const mongoose =require("mongoose")

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://sureshyarlanki83:SURESH%40123@react-mern.tbushkw.mongodb.net/devTinder")
}
module.exports=connectDb

