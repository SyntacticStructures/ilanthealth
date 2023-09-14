import {useInView} from "react-intersection-observer";
import {FormEvent, useEffect, useState} from "react";
import {Book} from "@/types";
import fetchBooks from "@/actions/fetchBooks";
import Books from "@/components/Books";
import Spinner from "@/components/Spinner";

export const API_PAGE_SIZE = 10;

export function InfiniteScrollBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [noResults, setNoResults] = useState(false);
    const [query, setQuery] = useState<string>('');
    const {ref, inView} = useInView();
    const [startIndex, setStartIndex] = useState(0);

    async function fetchPage() {
        const newStartIndex = startIndex + API_PAGE_SIZE;
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
            setNoResults(!booksData.length)
            setBooks(booksData)
        }
    }


    useEffect(() => {
        // Load if we see the loading spinner and
        // have already done the initial query
        if (inView && books.length >= API_PAGE_SIZE) {
            fetchPage();
        }
    })

    return (
        <div data-testid="infinite-scroll-books">
            <form className="flex items-center px-10 pt-8 max-w-3xl xl:max-w-4xl m-auto" data-testid='search-form' onSubmit={onSubmit}>
                <label htmlFor="voice-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <input name="query" type="text" data-testid='search-input' className="bg-gray-50 border border-gray-300 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-5 p-2.5" placeholder="Search Books" required/>
                </div>
                <button type="submit" className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>Search
                </button>
            </form>
            <Books books={books}/>
            {books.length === 0 &&
                <div className="m-auto text-slate-500 text-center">
                    {noResults ? `no results found for query: ${query}` : 'no books to show'}
                </div>
            }
            { books.length >= API_PAGE_SIZE &&
                <div ref={ref}>
                    <Spinner />
                </div>
            }
        </div>
    )
}
