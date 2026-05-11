const mongoose =require('mongoose');

const connectToDatabase = async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/CollecLIB');
        console.log('mongoDB connect successfully');
    }
    catch(error){
        console.error('MongoDB connection error:',error);
        process.exit(1);
    }
};
module.exports = connectToDatabase;