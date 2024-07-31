import React, { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users...');
        const response = await fetch('https://aaa4-34-74-131-28.ngrok-free.app/api/users', {
          headers: {
            'Cache-Control': 'no-cache',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        const text = await response.text(); // Obtenir la réponse en texte brut
        console.log('Response text:', text); // Loguer la réponse brute

        // Essayez de convertir en JSON
        const data = JSON.parse(text);
        console.log('Fetched Data:', text); // Afficher les données pour débogage
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      {error && <p style={{ color: 'red' }}>Failed to fetch users: {error.message}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
