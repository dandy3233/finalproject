import axios from 'axios';
import {
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
    try {
        console.log("Attempting to add product with ID:", id);  // Log the ID for debugging
        let response;

        // Try fetching from products endpoint
        try {
            response = await axios.get(`http://localhost:8000/api/products/${id}`);
        } catch (error) {
            console.log('Products endpoint failed, trying advertising endpoint...');
            console.error('Error response from products API:', error.response);

            // If products endpoint fails, try advertising endpoint
            try {
                response = await axios.get(`http://localhost:8000/api/advertising/${id}`);
            } catch (error) {
                console.error('Error response from advertising API:', error.response);
                throw new Error('Product not found in both products and advertising endpoints');
            }
        }

        const { data } = response;

        if (!data) {
            throw new Error('No product data returned');
        }

        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
                originalPrice: data.original_price,
                discount: data.discount_percentage
            }
        });

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

    } catch (error) {
        console.error('Failed to fetch product:', error);

        // Log full error response for debugging
        if (error.response) {
            console.error('API Response:', error.response);
            console.error('Status code:', error.response.status);
            console.error('Error message:', error.response.data.message || error.message);
        } else {
            console.error('Error:', error.message);
        }

        throw new Error(`Product not found: ${error.message}`);
    }
};


// Rest of the cart actions remain the same
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    });
    localStorage.setItem('paymentMethod', JSON.stringify(data));
};
