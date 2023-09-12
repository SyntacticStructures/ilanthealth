import Image from 'next/image';
import {Book} from "@/types";
export interface Props {
    books: Book[]
}

export default function Books({books}: Props) {

    return (
        <div>
            {books ? (books.map((book, idx) => (
                <div key={`${book.title}-${idx}`}>
                    <p>title: {book.title}</p>
                    <p>authors: {book.authors.join(', ')}</p>
                    <p>description: {book.description}</p>
                    <Image
                        src={book.thumbnail}
                        alt={book.title}
                        width={128}
                        height={201}
                    />
                </div>
            ))) : <div> no books </div>}
        </div>
    );
}
