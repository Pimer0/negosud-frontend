'use client'; // Ajoutez cette directive en haut du fichier

import { useEffect, useState } from 'react';

const useLocalStorage = (key: string) => {
    const [storedValue, setStoredValue] = useState<string | null>(null);

    useEffect(() => {
        const value = localStorage.getItem(key);
        setStoredValue(value);
    }, [key]);

    return storedValue;
};

export default useLocalStorage;
