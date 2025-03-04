export function calcStats(catsInfo) {
    const stats = {};

    catsInfo.forEach(cat => {
        if (stats[cat.country]) {
            stats[cat.country]++;
        } else {
            stats[cat.country] = 1;
        }
    });

    return stats;
}