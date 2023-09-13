import { render, fireEvent, waitFor } from '@testing-library/react';
import { InfiniteScrollBooks } from '../InfiniteScrollBooks';
import * as fetchBooks from "@/actions/fetchBooks";

jest.mock('../../actions/fetchBooks', () => ({
    __esModule: true,
    default: async () => {
        return [
            {
                title: 'Book 1',
                authors: ['Author 1'],
                description: 'Description 1',
                thumbnail: 'book1.jpg',
            },
            {
                title: 'Book 2',
                authors: ['Author 2', 'Author 3'],
                description: 'Description 2',
                thumbnail: 'book2.jpg',
            },
        ];
    },
}));


// TODO: test scroll behavior. This may be better done in an e2e test.
describe('InfiniteScrollBooks Component', () => {
    it('renders the component with initial state', () => {
        const { getByTestId } = render(<InfiniteScrollBooks />);
        const infiniteScrollBooksElement = getByTestId('infinite-scroll-books');
        expect(infiniteScrollBooksElement).toBeInTheDocument();
        expect(getByTestId('search-input')).toBeInTheDocument();
    });

    it('submits a search query and fetches books', async () => {
        const { getByTestId, getByText } = render(<InfiniteScrollBooks />);
        const searchInput = getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Test Query' } });
        fireEvent.submit(getByTestId('search-form'));

        await waitFor(() => {
            expect(getByTestId('books')).toBeInTheDocument();
            expect(getByText('Book 1')).toBeInTheDocument();
            expect(getByText('Author 1')).toBeInTheDocument();
            expect(getByText('Book 2')).toBeInTheDocument();
            expect(getByText('Author 2, Author 3')).toBeInTheDocument();
        });
    });

    it('displays "no results found" message when no books are found', async () => {
        jest.spyOn(fetchBooks, 'default').mockResolvedValue([]);

        const { getByTestId, getByText } = render(<InfiniteScrollBooks />);
        const searchInput = getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'Nonexistent Query' } });
        fireEvent.submit(getByTestId('search-form'));
        await waitFor(() => {
            expect(getByText('no results found for query: Nonexistent Query')).toBeInTheDocument();
        });
    });
});
