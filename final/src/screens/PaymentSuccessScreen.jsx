import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PaymentSuccessScreen() {
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        navigate("/placeorder"); // Redirect to home after clicking submit
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-2xl p-6 bg-white shadow-xl dark:bg-gray-900 sm:p-12 sm:rounded-3xl">
                <div className="text-center">
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-green-200 rounded-full dark:bg-green-700 shadow-md">
                        <svg className="h-14 w-14 text-green-600 dark:text-green-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400">Payment Successful!</h1>
                    <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Thank you for your purchase.</p>
                    <p className="mt-6 text-xl text-blue-600 dark:text-blue-400">
                        Your tool <span className="font-bold text-indigo-700 dark:text-indigo-400">http://example.org/</span> will be listed shortly.
                    </p>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        If you have any questions, contact us at:
                        <a href="mailto:AfricanStar@gmail.com" className="font-medium text-indigo-600 dark:text-indigo-400 underline">
                            AfricanStar@gmail.com
                        </a>
                    </p>
                </div>
                <div className="mt-8 text-center">
                    <button 
                        onClick={submitHandler}
                        className="px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-full shadow-lg transition-transform transform hover:scale-110 dark:from-green-400 dark:to-blue-400"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccessScreen;
