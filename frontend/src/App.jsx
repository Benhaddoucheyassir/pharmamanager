import { useState } from 'react'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState('dashboard')

  const navStyle = { padding: '8px 16px', cursor: 'pointer', border: 'none', background: 'none', fontSize: '15px' }
  const activeStyle = { ...navStyle, borderBottom: '2px solid #333', fontWeight: 600 }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1rem' }}>
      <nav style={{ display: 'flex', gap: '8px', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
        <button style={page === 'dashboard' ? activeStyle : navStyle} onClick={() => setPage('dashboard')}>Dashboard</button>
      </nav>

      {page === 'dashboard' && <Dashboard />}
    </div>
  )
}