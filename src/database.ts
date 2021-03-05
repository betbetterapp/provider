import mongoose from 'mongoose';
import { LiveFixtureModel, FixtureModel } from './models/FixtureModel.js';
import env from 'dotenv';
env.config();

export function connect() {
    return mongoose
        .connect(process.env.MONGO_URI!!, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => {
            console.log('> Successfully connected to db');
        })
        .catch(() => {
            throw new Error('Connection to database unsuccessful');
        });
}

async function getFixtures(live: boolean = false) {
    console.log('Fetching fixtures...');
    if (!live) {
        const res = await FixtureModel.find().lean();
        return res;
    } else {
        const res = await LiveFixtureModel.find().lean();
        return res;
    }
}

async function getFixtureById(fixtureId: number, live: boolean) {
    if (!live) return FixtureModel.findOne({ 'fixture.id': fixtureId });
    else return LiveFixtureModel.findOne({ 'fixture.id': fixtureId });
}

export { getFixtures, getFixtureById };
