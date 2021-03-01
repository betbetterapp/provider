import { Fixture } from '../models/FixtureModel.js';

import { getFixtures, getFixtureById } from '../database.js';

export async function resolveFixtures(_: any, args: { live: boolean }) {
    const fixtures: Fixture[] = await getFixtures(args.live);
    return fixtures.map((fixture) => ({
        id: fixture.fixture.id,
        timestamp: fixture.fixture.timestamp,
        referee: fixture.fixture.referee,
        goals: fixture.goals,
        league: fixture.league,
        teams: fixture.teams,
        status: fixture.fixture.status,
        events: fixture.events,
    }));
}

export async function resolveFixtureById(_: any, args: { id: string; live: boolean }) {
    const id = parseInt(args.id);
    const live = args.live;
    console.log(id);
    const fixture: Fixture | null = await getFixtureById(id, live);
    console.log('Fixture found!');
    if (fixture) {
        return parseFixtures([fixture])[0];
    } else {
        return null;
    }
}

function parseFixtures(fixtures: Fixture[]) {
    return fixtures.map((fixture) => {
        return {
            id: fixture.fixture.id,
            timestamp: fixture.fixture.timestamp,
            referee: fixture.fixture.referee,
            goals: fixture.goals,
            league: fixture.league,
            teams: fixture.teams,
            status: fixture.fixture.status,
            events: fixture.events,
        };
    });
}
