import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import Home from '../page';

describe('Home Component', () => {
    it('renders InfiniteScrollBooks', () => {
        const { getByTestId } = render(<Home />);
        const infiniteScrollBooks = getByTestId('infinite-scroll-books');
        expect(infiniteScrollBooks).toBeInTheDocument();
    });
});
