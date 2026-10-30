// src/frontend/src/App.js
import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 20px',
    boxSizing: 'border-box'
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
  },
  header: {
    padding: '24px 32px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  clusterBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
  },
  content: {
    padding: '32px'
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '15px',
    border: '1.5px solid #cbd5e1',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  item: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '6px',
    padding: '14px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1e293b'
  },
  itemMeta: {
    fontSize: '12px',
    color: '#64748b',
    fontFamily: 'Consolas, monospace',
    backgroundColor: '#e2e8f0',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px',
    color: '#94a3b8',
    fontSize: '14px'
  },
  footer: {
    padding: '14px 24px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    fontSize: '12px',
    color: '#64748b',
    display: 'flex',
    justifyContent: 'space-between'
  }
};

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItems = () => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(() => {
        setName('');
        fetchItems();
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Three-Tier Production App (AKS)</h2>
          <div style={styles.clusterBadge}>
            <span style={styles.statusDot}></span>
            <span>Cluster: three-tier-aks (Live)</span>
          </div>
        </div>

        <div style={styles.content}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <input
              style={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter task item"
              required
            />
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          <div style={styles.sectionTitle}>Persisted Items in MongoDB (StatefulSet)</div>

          {items.length === 0 ? (
            <div style={styles.emptyState}>No items recorded yet. Enter a task above!</div>
          ) : (
            <ul style={styles.list}>
              {items.map(item => (
                <li key={item._id} style={styles.item}>
                  <span style={styles.itemText}>{item.name}</span>
                  <span style={styles.itemMeta}>
                    ID: {item._id ? `${item._id.substring(0, 8)}...` : 'stored'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.footer}>
          <span>Frontend: React (Nginx) &bull; Backend: Node.js (Express :5000) &bull; DB: MongoDB (StatefulSet :27017)</span>
          <span>Status: Healthy</span>
        </div>
      </div>
    </div>
  );
}

export default App;
