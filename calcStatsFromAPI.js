import { loadData } from './loadData.js';
import { calcStats } from './calcStats.js';

export async function calcStatsFromAPI() {
    const catsInfo = await loadData();
    return calcStats(catsInfo);
}