import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the user data from the backend API
    const fetchUsers = async () => {
      try {
        // Retrieve the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch('http://localhost:8000/admin/auth/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Pass token in the Authorization header
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch users:', response.statusText);
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error during fetch:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty array ensures that it runs only once when the component mounts

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">No users available.</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => alert(`Edit user ${user.id}`)}>Edit</button>
                  <button onClick={() => alert(`Delete user ${user.id}`)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
