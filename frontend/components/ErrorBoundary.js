import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../hooks/hooks';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service here
        console.error('Screen Error:', error, errorInfo);
    }

    render() {
        const { hasError, error } = this.state;
        const { isDarkMode } = this.props;

        if (hasError) {
            return (
                <View style={[
                    styles.container,
                    { backgroundColor: isDarkMode ? '#000' : '#fff' }
                ]}>
                    <Text style={[
                        styles.errorText,
                        { color: isDarkMode ? '#fff' : '#000' }
                    ]}>
                        Something went wrong loading this screen.
                    </Text>
                    <Text style={[
                        styles.errorDetails,
                        { color: isDarkMode ? '#fff' : '#000' }
                    ]}>
                        {error?.message || 'Unknown error'}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            this.setState({ hasError: false, error: null });
                            if (this.props.onRetry) {
                                this.props.onRetry();
                            }
                        }}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const ErrorBoundaryWrapper = ({ children, onRetry }) => {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    return (
        <ErrorBoundary isDarkMode={isDarkMode} onRetry={onRetry}>
            {children}
        </ErrorBoundary>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorDetails: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
        opacity: 0.7,
    },
    retryButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    retryText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});

// Create a Redux-specific error boundary
export const ReduxErrorBoundary = ({ children }) => {
    return (
        <ErrorBoundary
            isDarkMode={false} // Default theme for Redux errors
            onRetry={() => {
                // You might want to dispatch a reset action here
                window.location.reload();
            }}
        >
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundaryWrapper; 