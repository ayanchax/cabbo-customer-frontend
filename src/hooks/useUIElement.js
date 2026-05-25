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

    /**
     * Programmatically focuses the given element if possible.
     * @param {HTMLElement|React.RefObject} element - DOM node or ref to focus
     */
    const focusOnElement = (element) => {
        if (!element) return;
        let el = element;
        // If a ref object is passed, get the current
        if (typeof element === "object" && "current" in element) {
            el = element.current;
        }
        if (el && typeof el.focus === "function") {
            el.focus();
        }
    };

    return { isElementInView, focusOnElement };

}