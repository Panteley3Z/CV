export default function useIntersectionObserver(elements, options = {}) {
    const callback = (entries, observer) => {
        entries.forEach( entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on-screen');
                observer.unobserve(entry.target)
            }
        })
    }
    const observer = new IntersectionObserver(callback, options);
    elements.forEach( element => {observer.observe(element)})
}