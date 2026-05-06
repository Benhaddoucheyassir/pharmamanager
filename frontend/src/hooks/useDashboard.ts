import { useState, useEffect } from 'react'
import { getDashboard } from '../api/dashboard'

// This "Interface" tells TypeScript exactly what is inside your Django response
interface DashboardStats {
  total_sales_count: number;
  daily_revenue: number;
  stock_health_percentage: number;
  sales_growth_percentage: number;
  revenue_growth_percentage: number;
  stock_change_delta: number;
  sales_trend: number[];
  revenue_trend: number[];
  stock_trend: number[];
}

export function useDashboard() {
  // We tell useState it will hold DashboardStats or null
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    getDashboard()
      .then(res => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const lastSync = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return { stats, loading, error, lastSync, refetch: fetchDashboard };
}