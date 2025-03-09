import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { saveShippingAddress } from '../actions/cartActions';
import MultiStepProgressBar from '../components/MultiStepProgressBar';

function ShippingAddressScreen() {
    const cart = useSelector(state => state.cart);
    const { cartItems, shippingAddress } = cart;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use navigate for routing

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment'); // Use navigate instead of history.push()
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [userInfo, cartItems, navigate]); // useEffect handles conditional navigation

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <MultiStepProgressBar step1 step2 />
            <h1 className="text-2xl font-bold mb-6">Shipping</h1>
            <form onSubmit={submitHandler} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Address</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter address"
                        value={address || ''}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">City</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter city"
                        value={city || ''}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Postal Code</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter postal code"
                        value={postalCode || ''}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Country</label>
                    <input
                        type="text"
                        required
                        placeholder="Enter country"
                        value={country || ''}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}

export default ShippingAddressScreen;
