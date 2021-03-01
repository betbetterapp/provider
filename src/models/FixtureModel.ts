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
    events: {
        type: [Object],
    },
});

export interface Fixture {
    fixture: {
        id: number;
        referee: string | null;
        timezone: string;
        timestamp: number;
        periods: {
            first: number;
            second: number;
        };
        venue: {
            id: number | null;
            name: string;
            city: string;
        };
        status: {
            long: string;
            short: string;
            elapsed: number;
        };
    };
    league: FixtureLeague;
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
            winner: boolean;
        };
        away: {
            id: number;
            name: string;
            logo: string;
            winner: boolean;
        };
    };
    goals: {
        home: number;
        away: number;
    };
    score: object;
    events: object[];
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

const FixtureModel = mongoose.model<Model<Fixture>>('Fixture', FixtureSchema, 'fixtures');
const LiveFixtureModel = mongoose.model<Model<Fixture>>('LiveFixture', FixtureSchema, 'live');

export { FixtureModel, LiveFixtureModel };
