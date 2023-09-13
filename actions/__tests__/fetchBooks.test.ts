import fetchBooks from '../fetchBooks';
import axios from 'axios'

describe('fetchBooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch books and return parsed JSON', async () => {
        const data = JSON.stringify([{ title: 'Book 1' }, { title: 'Book 2' }]);
        const mockResponse = {
            status: 200,
            data,
        };

        const mockPost = jest.fn().mockResolvedValue(mockResponse)

        jest.spyOn(axios, 'post').mockImplementation(mockPost);

        const query = 'searchQuery';
        const startIndex = 0;

        const result = await fetchBooks(query, startIndex);

        expect(mockPost).toHaveBeenCalledWith('/api/search', JSON.stringify({
            query,
            startIndex
        }));
        expect(result).toEqual([{ title: 'Book 1' }, { title: 'Book 2' }]);
    });

    it('should handle fetch error and return an empty array', async () => {
        const data = JSON.stringify([{ title: 'Book 1' }, { title: 'Book 2' }]);
        const mockResponse = {
            status: 400,
            data,
        };

        const mockPost = jest.fn().mockResolvedValue(mockResponse)

        jest.spyOn(axios, 'post').mockImplementation(mockPost);

        const query = 'searchQuery';
        const startIndex = 0;

        const result = await fetchBooks(query, startIndex);

        expect(mockPost).toHaveBeenCalledWith('/api/search', JSON.stringify({
            query,
            startIndex
        }));
        expect(result).toEqual([]);
    });
});
