import Image from 'next/image';
import {FormEvent, useState} from 'react';

interface Book {
    title: string,
    thumbnail: string
}

export default function Books() {
    const [booksData, setBooksData] = useState<Book[]>([]);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const booksResponse = await fetch('/api/search', {
            method: 'POST',
            body: formData,
        });

        if (booksResponse.ok) {
            const data = await booksResponse.json();
            setBooksData(JSON.parse(data));
        } else {
            // TODO: Handle error
            console.error('books api response failed');
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" name="query"/>
            <button type="submit">Submit</button>
            {booksData.map((book, idx) => (
                <div key={`${book.title}-${idx}`}>
                    <p>{book.title}</p>
                    <Image
                        src={book.thumbnail}
                        alt={book.title}
                        width={128}
                        height={201}
                    />
                </div>
            ))}
        </form>
    );
}