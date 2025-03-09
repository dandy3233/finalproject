import React from 'react'

function Message({ variant, children }) {
    const variantClasses = {
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
    }

    const variantClass = variantClasses[variant] || 'bg-gray-100 text-gray-800'

    return (
        <div className={`p-4 rounded-lg shadow-md ${variantClass}`}>
            {children}
        </div>
    )
}

export default Message
