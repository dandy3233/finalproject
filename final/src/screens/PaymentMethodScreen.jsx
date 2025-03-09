import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../actions/cartActions';
import MultiStepProgressBar from '../components/MultiStepProgressBar';
import bkash from '../statics/bkash.webp';
import cash from '../statics/cash.png';
import nagad from '../statics/chapa.png';
import rocket from '../statics/arif.png';

function PaymentMethodScreen({ history }) {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState('cash');

    useEffect(() => {
        if (!shippingAddress.address) {
            history.push('/shipping');
        }
    }, [shippingAddress, history]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder');
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <MultiStepProgressBar step1 step2 step3 />
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <form onSubmit={submitHandler}>
                <div className="space-y-4">
                    {[{ id: 'cash', label: 'Cash', img: cash },
                      { id: 'bkash', label: 'Bkash', img: bkash },
                      { id: 'nagad', label: 'Chapa', img: nagad },
                      { id: 'rocket', label: 'Arifpay', img: rocket }].map((method) => (
                        <label key={method.id} className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                            <div className="flex items-center space-x-4">
                                <img src={method.img} alt={method.label} className="w-12 h-12 rounded" />
                                <span className="font-medium">{method.label}</span>
                            </div>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={paymentMethod === method.id}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                        </label>
                    ))}
                </div>
                <button type="submit" className="mt-5 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Continue
                </button>
            </form>
        </div>
    );
}

export default PaymentMethodScreen;
