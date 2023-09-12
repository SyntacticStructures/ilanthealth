import {useState, useRef, useEffect} from 'react';

interface TruncatedTextProps {
    text: string;
}

export default function ClampedText({ text }: TruncatedTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [lineCount, setLineCount] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const maxLines = 6;

    useEffect(() => {
        if (containerRef.current) {
            const lineHeight = parseFloat(getComputedStyle(containerRef.current).lineHeight);
            const containerHeight = containerRef.current.clientHeight;

            setLineCount(Math.floor(containerHeight / lineHeight));
        }
    }, [text]);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const truncatedTextClass = `${
        isExpanded || lineCount === null || lineCount <= maxLines ? '' : 'line-clamp-' + maxLines
    }`;

    return (
        <div>
            <div ref={containerRef} className={truncatedTextClass}>
                {text}
            </div>
            {lineCount !== null && lineCount > maxLines && (
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
};
