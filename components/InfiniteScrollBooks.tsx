import {useInView} from "react-intersection-observer";
import {FormEvent, useEffect, useState} from "react";
import {Book} from "@/types";
import fetchBooks from "@/actions/fetchBooks";
import Books from "@/components/Books";

export function InfiniteScrollBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [query, setQuery] = useState<string>('');
    const {ref, inView} = useInView();
    const [startIndex, setStartIndex] = useState(0);

    async function fetchPage() {
        const newStartIndex = startIndex + 10;
        const newBooks = await fetchBooks(query, newStartIndex);
        setBooks([...books, ...newBooks]);
        setStartIndex(newStartIndex);
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get('query')?.toString();
        if (query) {
            setQuery(query)
            const booksData = await fetchBooks(query, 0);
            setBooks(booksData)
        }
    }


    useEffect(() => {
        // Load ff we see the loading spinner and
        // have already done the initial query
        if (inView && books.length >= 10) {
            fetchPage();
        }
    }, [inView])

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" name="query"/>
                <button type="submit">Submit</button>
            </form>
            <Books books={books}/>
            <div ref={ref}>
                load once you reach me
            </div>
        </div>
    )
}
