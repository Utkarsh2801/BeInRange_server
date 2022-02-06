const mongoose = require('mongoose');
let dbInstance;

const dbConnect = () => {
  mongoose.connect(
    process.env.MONGODB_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    (db) => {

        console.log("DB Connected");
        dbInstance = db;
    }
  );
};


exports.getDBInstance = async () => {
    if(!dbInstance) {
        await dbConnect();
    }

    return dbInstance;
} 

dbConnect();