import { useState } from "react";

function useSessionStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const set = (value: T) => {
        try {
            setStoredValue(value);
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };

    const clear = () => {
        try {
            setStoredValue(initialValue);
            window.sessionStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    return { value: storedValue, set, clear };
}

export default useSessionStorage;