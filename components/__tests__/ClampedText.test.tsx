import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import ClampedText, {MAX_CHARS} from '../ClampedText';

const testId = 'clamped-text';

describe('ClampedText Component', () => {
    it('renders the provided text', () => {
        const text = 'This is some test text.';
        const {getByTestId} = render(<ClampedText text={text}/>);
        const clampedTextElement = getByTestId(testId);

        expect(clampedTextElement).toHaveTextContent(text);
    });

    it('renders "No Description" when text is empty', () => {
        const emptyText = '';
        const {getByTestId} = render(<ClampedText text={emptyText}/>);
        const clampedTextElement = getByTestId(testId);

        expect(clampedTextElement).toHaveTextContent('No Description');
    });

    it('does not clamp when text is short enough', () => {
        const shortText = 'foo'.repeat(MAX_CHARS / 'foo'.length);
        const {getByTestId} = render(<ClampedText text={shortText}/>);
        const clampedTextElement = getByTestId(testId);
        expect(clampedTextElement.firstChild).not.toHaveClass('line-clamp-6');
    });

    it('clamps long text and provides a "Read More" button', async () => {
        const longText = 'foo'.repeat(MAX_CHARS / 'foo'.length + 1);
        const {getByTestId, getByText} = render(<ClampedText text={longText}/>);
        const clampedTextElement = getByTestId(testId);
        const readMoreButton = getByText('Read More');
        expect(clampedTextElement.firstChild).toHaveClass('line-clamp-6');
        expect(readMoreButton).toBeInTheDocument();
    });

    it('expands text when "Read More" is clicked', () => {
        const longText = 'foo'.repeat(MAX_CHARS / 'foo'.length + 1);
        const {getByText} = render(<ClampedText text={longText}/>);
        const readMoreButton = getByText('Read More');
        fireEvent.click(readMoreButton);

        expect(readMoreButton).toHaveTextContent('Read Less');
    });

    it('collapses text when "Read Less" is clicked', () => {
        const longText = 'foo'.repeat(MAX_CHARS / 'foo'.length + 1);
        const {getByText} = render(<ClampedText text={longText}/>);
        const readMoreButton = getByText('Read More');

        fireEvent.click(readMoreButton);
        fireEvent.click(getByText('Read Less'));
        expect(readMoreButton).toHaveTextContent('Read More');
    });
});