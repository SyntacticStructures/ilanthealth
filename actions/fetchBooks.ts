import {Book} from "@/types";

export default async function fetchBooks(query: string, startIndex: number): Promise<Book[]> {

    const booksResponse = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query, startIndex }),
    });

    if (booksResponse.ok) {
        const bs  = await booksResponse.json()
        return await JSON.parse(bs) || [] as Book[];
    } else {
        // TODO: Handle error
        console.error('books api response failed');
        return [];
    }
}
