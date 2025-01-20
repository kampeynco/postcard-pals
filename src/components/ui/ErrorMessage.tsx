import React from 'react';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="p-4 text-red-600 border border-red-300 rounded-md">
            {message}
        </div>
    );
};

export default ErrorMessage;
