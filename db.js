const mongoose =require('mongoose');

const connectToDatabase = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_LINK);
        console.log('mongoDB connect successfully');
    }
    catch(error){
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;