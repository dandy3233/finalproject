import axios from 'axios'
import { 
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM ,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,

} from '../constants/cartConstants'


export const addToCart =(id,qty) => async(dispatch, getState)=> { 

    const response = await axios.get(`http://localhost:8000/api/products/${id}`)

    dispatch({type:CART_ADD_ITEM, 
        payload:{

            product : response.data._id,
            name : response.data.name,
            image : response.data.image,
            price: response.data.price,
            countInStock : response.data.countInStock,
            qty
            
        



        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))





}

export const removeFromCart =(id) => async(dispatch, getState)=> {
    
        dispatch({
            type:CART_REMOVE_ITEM,
             payload:id
            })
    
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
        
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}
