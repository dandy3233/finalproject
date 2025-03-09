// actions/orderActions.js
import axios from 'axios';
import { ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL } from '../constants/orderConstants';

export const listOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const { data } = await axios.get('http://localhost:8000/api/orders/orders/');  // Backend API endpoint

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,  // Assign data to orders
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
