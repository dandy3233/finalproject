import React from 'react'

function FormContainer({ children }) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-center">
                <div className="w-full md:w-1/2">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default FormContainer
