import {useState, useRef} from 'react';

interface TruncatedTextProps {
    text: string;
}

export const MAX_CHARS = 300;

export default function ClampedText({text}: TruncatedTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div data-testid="clamped-text">
            <div ref={containerRef} className={text.length > MAX_CHARS && !isExpanded ? 'line-clamp-6' : ''}>
                {text.length ? text : 'No Description' }
            </div>
            {text.length > MAX_CHARS && (
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