import {Book} from "@/types";
import ClampedText from "@/components/ClampedText";

export interface Props {
    books: Book[]
}

export default function Books({books}: Props) {

    return (
        <ul data-testid="books" className="grid grid-cols-1 gap-y-10 gap-x-6 items-start p-8 max-w-3xl xl:max-w-4xl m-auto">
            {books.map((book, idx) => (
                <li key={`${book.title}-${idx}`} className="relative flex flex-col sm:flex-row xl:flex-row items-start p-8 border-5 rounded-lg bg-white">
                    <div className="order-1 ml-0 sm:ml-6 lg:ml-6 sm:w-3/4">
                        <h3 className="mb-1 text-slate-500 font-semibold">
                            <span className="mb-3 block text-2xl leading-6 text-slate-700">{book.title}</span>{book.authors.join(', ')}
                        </h3>
                        <ClampedText text={book.description} />
                    </div>
                    <div className="lg:w-1/5 sm:w-1/5">
                        <img src={book.thumbnail} alt={book.title}
                             className="mb-6 shadow-md rounded-lg bg-slate-50 sm:w-[17rem] sm:mb-0 xl:mb-6"/>
                    </div>
                </li>
            ))}

        </ul>
    )
}
