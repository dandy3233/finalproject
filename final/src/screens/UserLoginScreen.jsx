import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { login } from '../actions/userActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

function UserLoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    const userLogin = useSelector((state) => state.userLogin);
    const { error, loading, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl">

                {/* Logo */}
                <img src="/logo.png" alt="Brand Logo" className="mx-auto w-28 mb-6" />

                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
                    Sign In to Your Account
                </h1>

                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-500 mb-1 font-medium">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-400 focus:outline-none text-gray-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-500 mb-1 font-medium">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-400 focus:outline-none text-gray-700"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 mb-4 font-semibold">Or sign in with</p>
                    <div className="flex justify-center gap-6">
                        <a
                            href="http://localhost:8000/accounts/google/login/"
                            className="bg-red-500 hover:bg-red-600 shadow-lg rounded-full w-12 h-12 flex items-center justify-center 
                                       text-white text-2xl transition transform hover:scale-110"
                            aria-label="Sign in with Google"
                        >
                            <FaGoogle />
                        </a>
                        {/* <a
                            href="http://localhost:8000/accounts/facebook/login/"
                            className="bg-blue-700 hover:bg-blue-800 shadow-lg rounded-full w-12 h-12 flex items-center justify-center 
                                       text-white text-2xl transition transform hover:scale-110"
                            aria-label="Sign in with Facebook"
                        >
                            <FaFacebookF />
                        </a> */}
                    </div>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    New customer?{' '}
                    <Link
                        to={redirect ? `/register?redirect=${redirect}` : '/register'}
                        className="text-green-600 hover:underline font-semibold"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default UserLoginScreen;
