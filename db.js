const mongoose =require('mongoose');

const connectToDatabase = async()=>{
    try{
        await mongoose.connect('mongodb+srv://lesochkek:Parol1234@litrate.1zm7ycw.mongodb.net/?appName=LitRate/CollecLIB');
        console.log('mongoDB connect successfully');
    }
    catch(error){
        console.error('MongoDB connection error:',error);
        process.exit(1);
    }
};
module.exports = connectToDatabase;