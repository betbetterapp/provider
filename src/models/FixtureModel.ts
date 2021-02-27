import mongoose from 'mongoose';
const { Schema } = mongoose;

import { Model } from './model.js';

const FixtureSchema = new Schema({
    fixture: {
        type: Object,
        required: true,
    },
    league: {
        type: Object,
        required: true,
    },
    teams: {
        type: Object,
        required: true,
    },
    goals: {
        type: Object,
        required: true,
    },
    score: {
        type: Object,
        required: true,
    },
});

interface Fixture {
    fixture: any;
    league: FixtureLeague;
    teams: any;
    goals: any;
    score: any;
}

interface FixtureLeague {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
}

export default mongoose.model<Model<Fixture>>('Fixture', FixtureSchema, 'fixtures');
