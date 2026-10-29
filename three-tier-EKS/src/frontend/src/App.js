// src/frontend/src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  const fetchItems = () => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(() => {
      setName('');
      fetchItems();
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Three-Tier Production App (AKS)</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter task item" required />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {items.map(item => <li key={item._id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
export default App;