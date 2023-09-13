import {Book} from "@/types";
import axios from 'axios'

export default async function fetchBooks(query: string, startIndex: number): Promise<Book[]> {
    const booksResponse = await axios.post('/api/search', JSON.stringify({query, startIndex}))
    if (booksResponse.status >= 200 && booksResponse.status < 300) {
        const bs = await booksResponse.data
        return JSON.parse(bs) as Book[];
    } else {
        return [];
    }
}
