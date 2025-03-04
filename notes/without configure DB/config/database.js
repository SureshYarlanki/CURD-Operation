const mongoose =require("mongoose")

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://sureshyarlanki83:SURESH%40123@react-mern.tbushkw.mongodb.net/devTinder")
}
connectDb().then(() => {
    console.log("DB connected successfully")
}).catch(() => {
    console.log("cannot be connected to DB")
})

module.exports={connectDb}

