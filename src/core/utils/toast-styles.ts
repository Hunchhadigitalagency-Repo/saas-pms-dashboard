import type { ToastOptions } from 'react-hot-toast';

const baseStyle = {
    borderRadius: '2px',
    fontSize: '14px',
    maxWidth: '500px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

export const successOptions: ToastOptions = {
    style: {
        ...baseStyle,
        background: '#ffffff',
        color: '#3b3b3bff', // Emerald 500
        border: '1px solid #E5E7EB',
    },
    iconTheme: {
        primary: '#10B981',
        secondary: '#ffffff',
    },
};

export const errorOptions: ToastOptions = {
    style: {
        ...baseStyle,
        background: '#ffffff',
        color: '#3b3b3bff', // Red 500
        border: '1px solid #E5E7EB',
    },
    iconTheme: {
        primary: '#EF4444',
        secondary: '#ffffff',
    },
};

export const toastOptions: ToastOptions = {
    style: {
        ...baseStyle,
        background: '#363636',
        color: '#fff',
    }
};
