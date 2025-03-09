import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import { login } from '../actions/userActions'; // Assuming login action is already created
import { Link } from 'react-router-dom'; // Import Link here
import Message from '../components/Message'; // Ensure you have a Message component for error handling
import Loader from '../components/Loader'; // Ensure you have a Loader component

function UserLoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use navigate for routing
    const location = useLocation(); // Get location

    const redirect = new URLSearchParams(location.search).get('redirect') || '/'; // Get 'redirect' query or default to '/'

    const userLogin = useSelector(state => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect); // Redirect after login to the 'redirect' path (shipping in this case)
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password)); // Dispatch login action
    };

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <form onSubmit={submitHandler} className="space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-lg font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-lg font-medium mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
                    Sign In
                </button>
            </form>

            <div className="py-3">
                <p className="text-center">
                    New Customer? 
                    <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}
                        className="text-blue-500 hover:text-blue-700">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default UserLoginScreen;
