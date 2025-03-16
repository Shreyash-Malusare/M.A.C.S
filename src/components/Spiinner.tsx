import React from 'react';

interface SpinnerProps {
    size?: number;
    color?: string;
    message?: string; // Optional message prop
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, color = 'text-blue-500', message }) => {
    return (
        <div className="flex flex-col justify-center items-center space-y-4">
            <div
                className={`animate-spin rounded-full h-${size} w-${size} border-b-2 ${color}`}
                style={{ borderTopColor: 'transparent' }}
            ></div>
            {message && <p className="text-gray-600">{message}</p>}
        </div>
    );
};

export default Spinner;
