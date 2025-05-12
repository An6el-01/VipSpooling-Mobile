import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

export const useScreenCleanup = (cleanupFunction) => {
    const cleanupRef = useRef(cleanupFunction);
    cleanupRef.current = cleanupFunction;

    useFocusEffect(
        useCallback(() => {
            // This runs when the screen is focused
            return () => {
                // This runs when the screen is unfocused
                if (cleanupRef.current && typeof cleanupRef.current === 'function') {
                    cleanupRef.current();
                }
            };
        }, []) // Empty dependency array since we're using ref
    );
}; 