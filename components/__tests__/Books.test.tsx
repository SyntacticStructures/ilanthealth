import {render} from '@testing-library/react';
import Books from '../Books';
import {Book} from '@/types';


describe('Books Component', () => {
    it('renders a list of books', () => {
        const mockBooks: Book[] = [
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
        const {getByTestId, getAllByText, getByAltText} = render(<Books books={mockBooks}/>);
        const bookList = getByTestId('books');
        expect(bookList).toBeInTheDocument();

        expect(getAllByText('Book 1').length).toBe(1);
        expect(getAllByText('Author 1').length).toBe(1);
        expect(getAllByText('Book 2').length).toBe(1);
        expect(getAllByText('Author 2, Author 3').length).toBe(1);

        mockBooks.forEach((book) => {
            const thumbnail = getByAltText(book.title);
            expect(thumbnail).toBeInTheDocument();
        });
    });
});