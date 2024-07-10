export default function useLocalStorage(storageObjName = "", objToStorage = null) {
    const getData = () => JSON.parse(localStorage.getItem(storageObjName));
    const pushData = (d) => localStorage.setItem(storageObjName, JSON.stringify(d));

    if (objToStorage) {
        pushData(objToStorage);
        console.log("pushed")
    } else {
        const getted = getData();
        if (getted) { return getted }
        else { return false }
    }
}