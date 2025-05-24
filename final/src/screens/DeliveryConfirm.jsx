// import React, { useState } from 'react';
// import axios from 'axios';

// const ConfirmDelivery = () => {
//   const [orderNumber, setOrderNumber] = useState('');
//   const [confirmationNumber, setConfirmationNumber] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleConfirm = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');

//     try {
//       const res = await axios.post('http://localhost:8000/api/confirm_delivery/', {
//         confirmation_number: confirmationNumber,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
//           'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
//         },
//       });

//       setMessage(res.data.detail);
//       setOrderNumber('');
//       setConfirmationNumber('');
//     } catch (err) {
//       if (err.response?.status === 400) {
//         setError('Confirmation number is required.');
//       } else if (err.response?.status === 404) {
//         setError('Invalid confirmation number.');
//       } else if (err.response?.status === 403) {
//         setError('You are not authorized to confirm this delivery.');
//       } else {
//         setError(err.response?.data?.detail || 'Failed to confirm delivery');
//       }
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">Confirm Delivery</h2>
//       <form onSubmit={handleConfirm} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Order Number (optional)"
//           value={orderNumber}
//           onChange={(e) => setOrderNumber(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         />
//         <input
//           type="text"
//           placeholder="Confirmation Number"
//           value={confirmationNumber}
//           onChange={(e) => setConfirmationNumber(e.target.value)}
//           required
//           className="w-full px-3 py-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//         >
//           Confirm Delivery
//         </button>
//       </form>

//       {message && <p className="mt-4 text-green-600">{message}</p>}
//       {error && <p className="mt-4 text-red-600">{error}</p>}
//     </div>
//   );
// };

// export default ConfirmDelivery;