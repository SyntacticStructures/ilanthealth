import {useState, useRef, useEffect} from 'react';

interface TruncatedTextProps {
    text: string;
}

export default function ClampedText({text}: TruncatedTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const maxChars = 300;

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <div ref={containerRef} className={text.length > maxChars && !isExpanded ? 'line-clamp-6' : ''}>
                {text.length ? text : 'No Description' }
            </div>
            {text.length > maxChars && (
                <div>
                    {isExpanded ? (
                        <button
                            onClick={toggleExpansion}
                            className="text-blue-500 hover:underline cursor-pointer"
                        >
                            Read Less
                        </button>
                    ) : (
                        <button
                            onClick={toggleExpansion}
                            className="text-blue-500 hover:underline cursor-pointer mt-1"
                        >
                            Read More
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}