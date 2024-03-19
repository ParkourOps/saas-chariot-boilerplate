class LocalStorageVariable<Key extends string> {
    private readonly key;
    constructor(key: Key) {
        this.key = key;
    }
    set(value?: string) {
        if (value) {
            window.localStorage.setItem(this.key, value);
        } else {
            window.localStorage.removeItem(this.key);
        }
    }
    get() {
        return window.localStorage.getItem(this.key);
    }
}

export default LocalStorageVariable;
