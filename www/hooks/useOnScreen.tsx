import { useState, useEffect, RefObject } from "react";

export function useOnScreen(ref: RefObject<HTMLElement>, rootMargin = "0px") {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            ref.current ? observer.unobserve(ref.current) : null;
        };
    }, []);

    return isIntersecting;
}
