import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  LayoutDashboard, Package, ShoppingCart, Bell,
  X, Plus, Search, TrendingUp, DollarSign, AlertTriangle,
  CheckCircle2, Loader2, FlaskConical, LogOut, Zap,
  ArrowUpRight, MoreHorizontal, RefreshCw, Filter,
} from 'lucide-react'

const C = {
  obsidian: '#080C10', surface: '#0D1117', panel: '#111820',
  border: '#1C2A38', cyan: '#06B6D4', cyanDim: '#0E7490',
  emerald: '#10B981', emeraldDim: '#065F46',
  amber: '#F59E0B', red: '#EF4444',
  slate: '#64748B', slateLight: '#94A3B8', white: '#F1F5F9',
}

// ── Mock data — replace each with your real hook ──────────────────────────────
// [HOOK] const { medicaments } = useMedicaments()
const MOCK_MEDICAMENTS = [
  { id: 1, name: 'Amoxicillin 500mg',  price: '12.50', stock_quantity: 3,   category_detail: { name: 'Antibiotics'  }, is_low_stock: true  },
  { id: 2, name: 'Ibuprofen 400mg',    price: '8.00',  stock_quantity: 7,   category_detail: { name: 'Analgesics'   }, is_low_stock: true  },
  { id: 3, name: 'Metformin 1g',       price: '15.00', stock_quantity: 5,   category_detail: { name: 'Antidiabetics'}, is_low_stock: true  },
  { id: 4, name: 'Omeprazole 20mg',    price: '22.00', stock_quantity: 120, category_detail: { name: 'Gastro'       }, is_low_stock: false },
  { id: 5, name: 'Atorvastatin 40mg',  price: '35.00', stock_quantity: 88,  category_detail: { name: 'Cardio'       }, is_low_stock: false },
  { id: 6, name: 'Lisinopril 10mg',    price: '18.50', stock_quantity: 64,  category_detail: { name: 'Cardio'       }, is_low_stock: false },
]

// [HOOK] const { sales } = useSales()
const MOCK_SALES = [
  { id: 12, medicament_detail: { name: 'Omeprazole 20mg'   }, quantity: 2, total_price: '44.00',  status: 'active',    created_at: new Date().toISOString() },
  { id: 11, medicament_detail: { name: 'Atorvastatin 40mg' }, quantity: 1, total_price: '35.00',  status: 'active',    created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 10, medicament_detail: { name: 'Ibuprofen 400mg'   }, quantity: 3, total_price: '24.00',  status: 'cancelled', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 9,  medicament_detail: { name: 'Amoxicillin 500mg' }, quantity: 1, total_price: '12.50',  status: 'active',    created_at: new Date(Date.now() - 10800000).toISOString() },
]

const SALES_TREND = [
  { day: 'Mon', sales: 42, revenue: 8400  },
  { day: 'Tue', sales: 58, revenue: 11200 },
  { day: 'Wed', sales: 51, revenue: 9800  },
  { day: 'Thu', sales: 67, revenue: 13500 },
  { day: 'Fri', sales: 74, revenue: 15200 },
  { day: 'Sat', sales: 89, revenue: 18400 },
  { day: 'Sun', sales: 63, revenue: 12800 },
]

// [HOOK] const { data } = useDashboard()
const MOCK_DASHBOARD = { total_sales_today: 847, total_revenue_today: '24391.00', low_stock_count: 3 }

// ── Animation presets ─────────────────────────────────────────────────────────
const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: (i = 0) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

const popIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div className="relative rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: `linear-gradient(135deg, ${C.panel}, ${C.surface})`, border: `1px solid ${C.border}` }}
      variants={slideIn} custom={delay} initial="hidden" animate="visible"
      whileHover={{ borderColor: color + '60', boxShadow: `0 0 30px ${color}12`, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={18} color={color} />
        </div>
        <ArrowUpRight size={14} color={C.slate} />
      </div>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: C.white, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>{label}</div>
      </div>
      {sub && (
        <div className="flex items-center gap-1">
          <TrendingUp size={11} color={color} />
          <span style={{ fontSize: 11, color }}>{sub}</span>
        </div>
      )}
    </motion.div>
  )
}

// ── Smart Sale Modal ──────────────────────────────────────────────────────────
function SmartSaleModal({ onClose, medicaments, onSaleCreated }) {
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [step, setStep]       = useState('select') // select | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const filtered = medicaments.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) && m.stock_quantity > 0
  )

  const total = selected ? (parseFloat(selected.price) * quantity).toFixed(2) : '0.00'

  const handleConfirm = async () => {
    setStep('loading')
    try {
      // [HOOK] Replace with: await addSale({ medicament_id: selected.id, quantity })
      await new Promise(r => setTimeout(r, 1400))
      if (quantity > (selected?.stock_quantity || 0)) throw new Error(`Insufficient stock. Available: ${selected.stock_quantity}`)
      setStep('success')
      if (onSaleCreated) onSaleCreated({ medicament: selected, quantity, total })
    } catch (err) {
      setErrorMsg(err.message)
      setStep('error')
    }
  }

  const resetModal = () => { setStep('select'); setSelected(null); setQuantity(1); setSearch('') }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose} />
      <motion.div className="relative h-full w-full max-w-md flex flex-col"
        style={{ background: C.surface, borderLeft: `1px solid ${C.border}`, boxShadow: `-40px 0 80px ${C.obsidian}` }}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${C.cyan}15`, border: `1px solid ${C.cyan}30` }}>
              <Zap size={18} color={C.cyan} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.white }}>Smart Sale</div>
              <div style={{ fontSize: 11, color: C.slate }}>Select medication → confirm</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: C.slate }}><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">

            {step === 'select' && (
              <motion.div key="select" variants={popIn} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                <div className="relative">
                  <Search size={14} color={C.slate} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search medications..." autoFocus
                    style={{ width: '100%', paddingLeft: 36, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, background: C.panel, border: `1px solid ${C.border}`, color: C.white, fontFamily: "'DM Mono', monospace", fontSize: 13, outline: 'none' }} />
                </div>

                <div className="flex flex-col gap-2">
                  {filtered.map(med => (
                    <button key={med.id} onClick={() => setSelected(med)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                        background: selected?.id === med.id ? `${C.cyan}12` : C.panel,
                        border: `1px solid ${selected?.id === med.id ? C.cyan + '50' : C.border}`,
                      }}>
                      <div>
                        <div style={{ fontSize: 14, color: C.white, fontWeight: 500 }}>{med.name}</div>
                        <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>{med.category_detail.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: C.emerald }}>{med.price} MAD</div>
                        <div style={{ fontSize: 11, color: med.is_low_stock ? C.amber : C.slate, marginTop: 2 }}>
                          {med.stock_quantity} in stock{med.is_low_stock ? ' ⚠' : ''}
                        </div>
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', color: C.slate, fontSize: 13, padding: '2rem 0' }}>No medications found</div>
                  )}
                </div>

                {selected && (
                  <motion.div className="flex flex-col gap-4 p-4 rounded-xl"
                    style={{ background: `${C.cyan}0A`, border: `1px solid ${C.cyan}30` }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ fontSize: 13, color: C.slateLight }}>
                      Selected: <span style={{ color: C.cyan }}>{selected.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 12, color: C.slate }}>Quantity</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          style={{ width: 32, height: 32, borderRadius: 8, background: C.panel, border: `1px solid ${C.border}`, color: C.white, cursor: 'pointer', fontSize: 16 }}>-</button>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: C.white, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(selected.stock_quantity, quantity + 1))}
                          style={{ width: 32, height: 32, borderRadius: 8, background: C.panel, border: `1px solid ${C.border}`, color: C.white, cursor: 'pointer', fontSize: 16 }}>+</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontSize: 12, color: C.slate }}>Total</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color: C.emerald, fontWeight: 700 }}>{total} MAD</span>
                    </div>
                    <button onClick={handleConfirm} style={{ width: '100%', padding: '12px 0', borderRadius: 12, background: `linear-gradient(135deg, ${C.cyan}, ${C.emerald})`, color: C.obsidian, fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                      Confirm Sale →
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 'loading' && (
              <motion.div key="loading" variants={popIn} initial="hidden" animate="visible" exit="exit"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '5rem 0' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={40} color={C.cyan} />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: C.white, fontSize: 15, fontWeight: 600 }}>Processing sale...</div>
                  <div style={{ color: C.slate, fontSize: 12, marginTop: 4 }}>Snapshotting price · Deducting stock</div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" variants={popIn} initial="hidden" animate="visible" exit="exit"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '4rem 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                  <CheckCircle2 size={64} color={C.emerald} style={{ filter: `drop-shadow(0 0 20px ${C.emerald})` }} />
                </motion.div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>Sale Recorded!</div>
                  <div style={{ color: C.slate, fontSize: 13, marginTop: 4 }}>{quantity}× {selected?.name} · {total} MAD</div>
                </div>
                <div style={{ width: '100%', padding: 16, borderRadius: 12, background: `${C.emerald}0A`, border: `1px solid ${C.emerald}25` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: C.slate }}>Price snapshot</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: C.emerald }}>{selected?.price} MAD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 8 }}>
                    <span style={{ color: C.slate }}>Remaining stock</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", color: C.white }}>{(selected?.stock_quantity || 0) - quantity}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                  <button onClick={resetModal} style={{ flex: 1, padding: '12px 0', borderRadius: 12, background: C.panel, border: `1px solid ${C.border}`, color: C.white, fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: 'pointer' }}>New Sale</button>
                  <button onClick={onClose}   style={{ flex: 1, padding: '12px 0', borderRadius: 12, background: `${C.emerald}20`, border: `1px solid ${C.emerald}40`, color: C.emerald, fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: 'pointer' }}>Done</button>
                </div>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div key="error" variants={popIn} initial="hidden" animate="visible" exit="exit"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '4rem 0' }}>
                <AlertTriangle size={56} color={C.amber} style={{ filter: `drop-shadow(0 0 16px ${C.amber})` }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.white }}>Sale Failed</div>
                  <div style={{ color: C.amber, fontSize: 13, marginTop: 4 }}>{errorMsg}</div>
                </div>
                <button onClick={() => setStep('select')} style={{ padding: '12px 24px', borderRadius: 12, background: C.panel, border: `1px solid ${C.border}`, color: C.white, fontFamily: "'DM Mono', monospace", cursor: 'pointer' }}>Try Again</button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Low Stock Panel ───────────────────────────────────────────────────────────
function LowStockPanel({ medicaments }) {
  const lowStock = medicaments.filter(m => m.is_low_stock)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell size={16} color={C.amber} />
            {lowStock.length > 0 && (
              <motion.div className="absolute w-2.5 h-2.5 rounded-full"
                style={{ background: C.amber, boxShadow: `0 0 8px ${C.amber}`, top: -4, right: -4 }}
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            )}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Stock Alerts</span>
          <span style={{ padding: '2px 8px', borderRadius: 12, background: `${C.amber}20`, color: C.amber, fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{lowStock.length}</span>
        </div>
        <RefreshCw size={13} color={C.slate} style={{ cursor: 'pointer' }} />
      </div>
      <div className="p-3 flex flex-col gap-2">
        {lowStock.length === 0
          ? <div style={{ textAlign: 'center', color: C.slate, fontSize: 13, padding: '1.5rem 0' }}>All stock levels healthy ✓</div>
          : lowStock.map((med, i) => (
            <motion.div key={med.id} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: `${C.amber}08`, border: `1px solid ${C.amber}25` }}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <div>
                <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{med.name}</div>
                <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>{med.category_detail.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: C.amber, fontWeight: 700 }}>{med.stock_quantity}</div>
                <div style={{ fontSize: 10, color: C.slate }}>remaining</div>
              </div>
            </motion.div>
          ))
        }
      </div>
    </div>
  )
}

// ── Sales Table ───────────────────────────────────────────────────────────────
function SalesTable({ sales }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>Recent Sales</span>
        <div className="flex items-center gap-2">
          <Filter size={13} color={C.slate} />
          <MoreHorizontal size={14} color={C.slate} />
        </div>
      </div>
      {sales.map((sale, i) => (
        <motion.div key={sale.id} className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: i < sales.length - 1 ? `1px solid ${C.border}40` : 'none' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: sale.status === 'cancelled' ? `${C.red}10` : `${C.emerald}10` }}>
              <ShoppingCart size={13} color={sale.status === 'cancelled' ? C.red : C.emerald} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.white }}>{sale.medicament_detail.name}</div>
              <div style={{ fontSize: 11, color: C.slate }}>×{sale.quantity} · #{sale.id}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: sale.status === 'cancelled' ? C.red : C.emerald }}>
              {sale.status === 'cancelled' ? '-' : '+'}{sale.total_price} MAD
            </div>
            <div style={{ fontSize: 10, color: C.slate }}>
              {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Chart Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ padding: '12px 16px', borderRadius: 12, background: C.panel, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11, color: C.slate, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: C.cyan }}>{payload[0]?.value} sales</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: C.emerald }}>{payload[1]?.value?.toLocaleString()} MAD</div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, onBack }) {
  const navItems = [
    { id: 'dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
    { id: 'medicaments', icon: Package,          label: 'Medicaments' },
    { id: 'sales',       icon: ShoppingCart,     label: 'Sales'       },
    { id: 'alerts',      icon: Bell,             label: 'Alerts'      },
  ]

  return (
    <motion.aside className="hidden md:flex flex-col w-56 h-full"
      style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}
      initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="p-5 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.cyanDim}, ${C.emeraldDim})`, border: `1px solid ${C.cyan}40` }}>
          <FlaskConical size={15} color={C.cyan} />
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: C.white, fontSize: 14 }}>
          Pharma<span style={{ color: C.cyan }}>Mgr</span>
        </span>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={() => setActive(id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
              background: isActive ? `${C.cyan}15` : 'transparent',
              border: `1px solid ${isActive ? C.cyan + '40' : 'transparent'}`,
              color: isActive ? C.cyan : C.slateLight,
            }}>
              <Icon size={16} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{label}</span>
            </button>
          )
        })}
      </nav>
      <div className="p-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, width: '100%', color: C.slate, fontSize: 12, fontFamily: "'DM Mono', monospace", background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <LogOut size={13} /> Back to landing
        </button>
      </div>
    </motion.aside>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function MVPLayout({ onBack }) {
  const [activeNav, setActiveNav]     = useState('dashboard')
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [recentSales, setRecentSales] = useState(MOCK_SALES)
  const [chartMetric, setChartMetric] = useState('sales')

  const handleSaleCreated = useCallback((sale) => {
    setRecentSales(prev => [{
      id: Date.now(),
      medicament_detail: { name: sale.medicament.name },
      quantity: sale.quantity,
      total_price: sale.total,
      status: 'active',
      created_at: new Date().toISOString(),
    }, ...prev])
  }, [])

  return (
    <div style={{ background: C.obsidian, height: '100vh', fontFamily: "'Syne', 'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input { outline: none; }
        input::placeholder { color: #64748B; }
        button { border: none; }
      `}</style>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={activeNav} setActive={setActiveNav} onBack={onBack} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: C.white, margin: 0 }}>
                {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
              </h1>
              <p style={{ fontSize: 12, color: C.slate, margin: 0 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <motion.button onClick={() => setSaleModalOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: `linear-gradient(135deg, ${C.cyan}20, ${C.emerald}20)`, border: `1px solid ${C.cyan}40`, color: C.cyan, fontFamily: "'DM Mono', monospace", fontSize: 13, cursor: 'pointer' }}
                whileHover={{ boxShadow: `0 0 20px ${C.cyan}30` }} whileTap={{ scale: 0.97 }}>
                <Plus size={14} /> New Sale
              </motion.button>
              <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 12, background: C.panel, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setActiveNav('alerts')}>
                <Bell size={15} color={C.slateLight} />
                <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: C.obsidian, fontWeight: 700 }}>
                  {MOCK_MEDICAMENTS.filter(m => m.is_low_stock).length}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <AnimatePresence mode="wait">

              {activeNav === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  {/* KPIs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <KpiCard icon={ShoppingCart} label="Sales Today"    value={MOCK_DASHBOARD.total_sales_today.toLocaleString()} sub="+12% vs yesterday" color={C.cyan}    delay={0} />
                    <KpiCard icon={DollarSign}   label="Revenue Today"  value={parseInt(MOCK_DASHBOARD.total_revenue_today).toLocaleString()} sub="MAD · +8%"      color={C.emerald} delay={1} />
                    <KpiCard icon={Package}      label="Total SKUs"     value="1,204"  sub="Active medications"                color={C.cyan}    delay={2} />
                    <KpiCard icon={AlertTriangle}label="Low Stock"      value={MOCK_DASHBOARD.low_stock_count} sub="Need restock"                color={C.amber}   delay={3} />
                  </div>

                  {/* Chart + Alerts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                    <motion.div className="rounded-2xl p-5"
                      style={{ background: C.panel, border: `1px solid ${C.border}` }}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>Sales Trend</div>
                          <div style={{ fontSize: 11, color: C.slate, marginTop: 2 }}>Last 7 days</div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['sales', 'revenue'].map(m => (
                            <button key={m} onClick={() => setChartMetric(m)} style={{
                              padding: '6px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer',
                              background: chartMetric === m ? `${C.cyan}20` : 'transparent',
                              border: `1px solid ${chartMetric === m ? C.cyan + '40' : C.border}`,
                              color: chartMetric === m ? C.cyan : C.slate,
                              fontFamily: "'DM Mono', monospace",
                            }}>{m}</button>
                          ))}
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={SALES_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                          <defs>
                            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor={C.cyan}    stopOpacity={0.3} />
                              <stop offset="95%" stopColor={C.cyan}    stopOpacity={0}   />
                            </linearGradient>
                            <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor={C.emerald} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={C.emerald} stopOpacity={0}   />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                          <XAxis dataKey="day" tick={{ fill: C.slate, fontSize: 11, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: C.slate, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.border }} />
                          {chartMetric === 'sales'
                            ? <Area type="monotone" dataKey="sales"   stroke={C.cyan}    strokeWidth={2} fill="url(#grad1)" dot={false} activeDot={{ r: 4, fill: C.cyan,    stroke: C.obsidian, strokeWidth: 2 }} />
                            : <Area type="monotone" dataKey="revenue" stroke={C.emerald} strokeWidth={2} fill="url(#grad2)" dot={false} activeDot={{ r: 4, fill: C.emerald, stroke: C.obsidian, strokeWidth: 2 }} />
                          }
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <LowStockPanel medicaments={MOCK_MEDICAMENTS} />
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <SalesTable sales={recentSales} />
                  </motion.div>
                </motion.div>
              )}

              {activeNav === 'medicaments' && (
                <motion.div key="meds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, color: C.white, fontWeight: 600 }}>All Medicaments</span>
                    <button onClick={() => setSaleModalOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: `${C.cyan}15`, border: `1px solid ${C.cyan}30`, color: C.cyan, fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: 'pointer' }}>
                      <Plus size={12} /> New Sale
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                    {MOCK_MEDICAMENTS.map((med, i) => (
                      <motion.div key={med.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, background: C.panel, border: `1px solid ${med.is_low_stock ? C.amber + '30' : C.border}` }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: med.is_low_stock ? `${C.amber}15` : `${C.emerald}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={15} color={med.is_low_stock ? C.amber : C.emerald} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: C.white, fontWeight: 500 }}>{med.name}</div>
                            <div style={{ fontSize: 11, color: C.slate }}>{med.category_detail.name}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: C.emerald }}>{med.price} MAD</div>
                          <div style={{ fontSize: 11, color: med.is_low_stock ? C.amber : C.slate }}>{med.stock_quantity} in stock</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeNav === 'sales' && (
                <motion.div key="sales" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SalesTable sales={recentSales} />
                </motion.div>
              )}

              {activeNav === 'alerts' && (
                <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LowStockPanel medicaments={MOCK_MEDICAMENTS} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {saleModalOpen && (
          <SmartSaleModal
            medicaments={MOCK_MEDICAMENTS}
            onClose={() => setSaleModalOpen(false)}
            onSaleCreated={(sale) => { handleSaleCreated(sale); setSaleModalOpen(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}