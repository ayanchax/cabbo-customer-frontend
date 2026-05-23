export function useUIElement() {

    const isElementInView = (el, container) => {
        try {
            if (!el || !container) return false;
            const elRect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return (
                elRect.top >= containerRect.top &&
                elRect.bottom <= containerRect.bottom &&
                elRect.left >= containerRect.left &&
                elRect.right <= containerRect.right
            );
        }
        catch (e) {
            console.error("Error in isElementInView:", e);
            return false;
        }

    }

    return { isElementInView };

}