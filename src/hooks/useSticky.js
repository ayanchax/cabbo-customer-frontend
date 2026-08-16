import { useState, useEffect } from "react";
export const useSticky = (ref) => {
    const [isSticky, setIsSticky] = useState(false);
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting);
            },
            { root: null, threshold: 0 }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);

    return isSticky;

}