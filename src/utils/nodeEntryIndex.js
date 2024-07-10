export default function nodeEntryIndex(nodelist, targetItem) {
    if (typeof(targetItem) === 'number') { return targetItem }
    for (let i = 0; i < nodelist.length; i++) {
        if (targetItem === nodelist[i]) { return i }
    }
    return -1
}