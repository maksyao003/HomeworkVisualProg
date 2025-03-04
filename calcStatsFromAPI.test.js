import { calcStatsFromAPI } from './calcStatsFromAPI.js';
import { loadData } from './loadData.js';

jest.mock('./loadData.js', () => ({
    loadData: jest.fn(), 
}));

test("calcStatsFromAPI returns correct stats", async () => {
    const mockData = [
        {
            breed: 'Turkish Van',
            country: 'developed in the United Kingdom (founding stock from Turkey)',
            origin: 'Natural',
            coat: 'Semi-long',
            pattern: 'Van'
        },
        {
            breed: 'York Chocolate',
            country: 'United States (New York)',
            origin: 'Natural',
            coat: 'Long',
            pattern: 'Solid'
        }
    ];

    
    loadData.mockResolvedValue(mockData);

    const stats = await calcStatsFromAPI();

    
    expect(loadData).toHaveBeenCalledTimes(1);

    
    expect(stats).toEqual({
        'developed in the United Kingdom (founding stock from Turkey)': 1,
        'United States (New York)': 1
    });
});