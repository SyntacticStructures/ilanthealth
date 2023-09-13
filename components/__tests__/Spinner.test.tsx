import { render } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner Component', () => {
    it('renders the spinner', () => {
        const { getByTestId } = render(<Spinner />);
        const spinnerElement = getByTestId('spinner');
        expect(spinnerElement).toBeInTheDocument();
    });
});