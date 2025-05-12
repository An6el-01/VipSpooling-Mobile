import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'app_state';

export const saveState = async (state) => {
    try {
        const serializedState = JSON.stringify(state);
        await AsyncStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
        console.error('Error saving state:', err);
    }
};

export const loadState = async () => {
    try {
        const serializedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading state:', err);
        return undefined;
    }
}; 