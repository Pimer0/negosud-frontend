'use client'
import { useEffect } from 'react';
import { usePanierContext } from '@/context/PanierContext';

const PanierCount = () => {
    const { panierCount, updatePanier } = usePanierContext();

    useEffect(() => {
        updatePanier();
    }, [updatePanier]);

    return <span style={{ marginLeft: '0.3rem' }}>{panierCount}</span>;
};

export default PanierCount;
