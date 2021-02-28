import mongoose from 'mongoose';
import FixtureModel from './models/FixtureModel.js';
import env from 'dotenv';
env.config();

export function connect() {
    return mongoose.connect(process.env.MONGO_URI!!, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
}
