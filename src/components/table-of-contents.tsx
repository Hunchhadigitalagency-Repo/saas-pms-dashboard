import { useEffect, useState, useRef } from 'react';

interface HeadingItem {
    id: string;
    text: string;
    level: 'h1' | 'h2';
}

interface TableOfContentsProps {
    contentSelector: string;
}

export function TableOfContents({ contentSelector }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<HeadingItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const isScrollingRef = useRef(false);

    useEffect(() => {
        // Get all h1 and h2 elements from the content
        const contentElement = document.querySelector(contentSelector);
        if (!contentElement) return;

        const headingElements = contentElement.querySelectorAll('h1, h2');
        const headingItems: HeadingItem[] = [];

        headingElements.forEach((element, index) => {
            const text = element.textContent || '';
            const id = element.id || `heading-${index}`;

            // Set id if not already present
            if (!element.id) {
                element.id = id;
            }

            const level = element.tagName.toLowerCase() as 'h1' | 'h2';
            headingItems.push({ id, text, level });
        });

        setHeadings(headingItems);

        // Set initial active heading
        if (headingItems.length > 0) {
            setActiveId(headingItems[0].id);
        }
    }, [contentSelector]);

    // Enhanced scroll tracking with debounce to prevent glitch
    useEffect(() => {
        const handleScroll = () => {
            // Skip if we're animating from a click
            if (isScrollingRef.current) return;

            const headingElements = document.querySelectorAll('h1, h2');
            if (headingElements.length === 0) return;

            // Check if we're at the bottom of the page (within 200px)
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200;

            if (isAtBottom) {
                // At bottom: show last heading as active
                const lastHeading = headingElements[headingElements.length - 1];
                if (lastHeading) {
                    setActiveId(lastHeading.id);
                }
                return;
            }

            // Not at bottom: find the heading closest to the top of viewport
            let closestId = '';
            let closestDistance = Infinity;

            headingElements.forEach((element) => {
                const rect = element.getBoundingClientRect();

                // Only consider headings that are visible or just above viewport
                if (rect.top > -100 && rect.top < window.innerHeight) {
                    const distance = Math.abs(rect.top);

                    // Get the closest heading to the top of the viewport
                    if (distance < closestDistance) {
                        closestId = element.id;
                        closestDistance = distance;
                    }
                }
            });

            if (closestId) {
                setActiveId(closestId);
            }
        };

        // Use passive listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Set flag to prevent scroll tracking interference
            isScrollingRef.current = true;
            setActiveId(id);

            // Clear any pending timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Scroll smoothly
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Re-enable scroll tracking after scroll completes
            scrollTimeoutRef.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className="sticky top-6 w-72 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/40 scrollbar-track-transparent">
            <div className="bg-card rounded-xl border border-border/50 shadow-lg p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 bg-secondary rounded-full"></div>
                    <h3 className="text-lg font-bold text-primary">
                        Contents
                    </h3>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/30 mb-4"></div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => handleClick(heading.id)}
                            className={`relative w-full text-left text-sm px-3 py-2 rounded-md transition-all duration-200 ${heading.level === 'h1'
                                ? 'font-medium'
                                : 'ml-4 font-normal'
                                } ${activeId === heading.id
                                    ? 'bg-secondary/20 text-secondary'
                                    : 'text-popover-foreground/70 hover:text-popover-foreground hover:bg-gray-700/20'
                                }`}
                        >
                            <span className="truncate">
                                {heading.text}
                            </span>
                        </button>
                    ))}
                </nav>

                {/* Footer - Progress indicator */}
                <div className="mt-5 pt-4">
                    <div className="text-xs text-popover-foreground/50 text-center">
                        {Math.round((headings.findIndex(h => h.id === activeId) + 1) / headings.length * 100)}% complete
                    </div>
                </div>
            </div>
        </div>
    );
}
