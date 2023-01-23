export function saveItemInLocalStorage(key: string, object: object) {
    const localStorage = window.localStorage;
    const data = JSON.stringify(object);
    localStorage.setItem(key, data);
}

export function getItemInLocalStorage(key: string) {
    const localStorage = window.localStorage;
    const data = localStorage.getItem(key);
    if (data === null) return false;

    return JSON.parse(data);
}
