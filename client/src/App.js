import React from 'react';
import UserForm from './UserForm';
import UserList from './UserList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bible Learning App</h1>
      </header>
      <UserForm />
      <UserList />
    </div>
  );
}

export default App;
