import { useDashboard } from '../hooks/useDashboard'

export default function Dashboard() {
  const { data, loading, error } = useDashboard()

  if (loading) return <p>Loading dashboard...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Sales today</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>{data.total_sales_today}</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Revenue today</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>{data.total_revenue_today} MAD</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #f90', borderRadius: '8px', flex: 1 }}>
          <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>Low stock alerts</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 600, color: '#c00' }}>{data.low_stock_count}</p>
        </div>
      </div>

      {data.low_stock_medicaments.length > 0 && (
        <div>
          <h2>Low Stock Items</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Stock</th>
                <th style={{ padding: '8px' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_medicaments.map(med => (
                <tr key={med.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{med.name}</td>
                  <td style={{ padding: '8px', color: '#c00', fontWeight: 600 }}>{med.stock_quantity}</td>
                  <td style={{ padding: '8px' }}>{med.price} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}