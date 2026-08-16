export const useFragmentScroll = () => {

    const scrollToFragment = (event, fragmentId) => {
        event.preventDefault();
        const sectionId = fragmentId;
        const section = document.getElementById(sectionId);

        window.history.replaceState(null, "", `#${sectionId}`);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        section?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }
    return { scrollToFragment };
}