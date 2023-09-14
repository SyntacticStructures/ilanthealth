import {useState, useRef} from 'react';

interface TruncatedTextProps {
    text: string;
}

export const MAX_CHARS = 350;

export default function ClampedText({text}: TruncatedTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    let className = ''
    if (text.length > MAX_CHARS && !isExpanded) {
        className = 'line-clamp-6'
    }
    return (
        <div data-testid="clamped-text">
            <div ref={containerRef} className={className}>
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