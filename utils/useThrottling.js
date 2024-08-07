export default function useThrottling(callee, timeout) {
    let timer = null;
    return function perform(args) {
        if (timer) { return }
        timer = setTimeout(() => {
            callee(args);
            clearTimeout(timer);
            timer = null
        }, timeout)
    }
}