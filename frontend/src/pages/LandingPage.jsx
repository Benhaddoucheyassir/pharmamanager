import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  Activity, BarChart3, Bell, ChevronRight, Package,
  Shield, Zap, ArrowRight, TrendingUp, Database,
  Cpu, FlaskConical, Lock, Globe,
} from 'lucide-react'

const C = {
  obsidian: '#080C10', surface: '#0D1117', panel: '#111820',
  border: '#1C2A38', borderGlow: '#0EA5E9',
  cyan: '#06B6D4', cyanDim: '#0E7490',
  emerald: '#10B981', emeraldDim: '#065F46',
  slate: '#64748B', slateLight: '#94A3B8', white: '#F1F5F9',
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

function HeroGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{ background: `radial-gradient(circle, ${C.cyan}18 0%, transparent 70%)`, boxShadow: `0 0 80px ${C.cyan}22` }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{ border: `1px solid ${C.cyan}30` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div key={deg} className="absolute w-2 h-2 rounded-full"
            style={{
              background: C.cyan, top: '50%', left: '50%',
              transformOrigin: '0 0',
              transform: `rotate(${deg}deg) translateX(136px) translateY(-4px)`,
              boxShadow: `0 0 8px ${C.cyan}`,
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: deg / 360 * 2 }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute w-52 h-52 rounded-full"
        style={{ border: `1px solid ${C.emerald}40` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <motion.div key={deg} className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: C.emerald, top: '50%', left: '50%',
              transformOrigin: '0 0',
              transform: `rotate(${deg}deg) translateX(100px) translateY(-3px)`,
              boxShadow: `0 0 6px ${C.emerald}`,
            }}
          />
        ))}
      </motion.div>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <motion.div className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${C.panel}, ${C.surface})`,
            border: `1px solid ${C.border}`,
            boxShadow: `0 0 40px ${C.cyan}22, inset 0 1px 0 ${C.border}`,
          }}
          animate={{ boxShadow: [`0 0 30px ${C.cyan}18`, `0 0 60px ${C.cyan}33`, `0 0 30px ${C.cyan}18`] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <FlaskConical size={40} color={C.cyan} style={{ position: 'relative', filter: `drop-shadow(0 0 12px ${C.cyan})` }} />
      </div>
      {[
        { icon: Activity, x: -110, y: -60, color: C.cyan,    label: 'Vitals'    },
        { icon: BarChart3, x:  110, y: -40, color: C.emerald, label: 'Analytics' },
        { icon: Package,   x:  -90, y:  80, color: C.emerald, label: 'Stock'     },
        { icon: Shield,    x:  100, y:  70, color: C.cyan,    label: 'Secure'    },
      ].map(({ icon: Icon, x, y, color, label }, i) => (
        <motion.div key={label} className="absolute flex flex-col items-center gap-1"
          style={{ transform: `translate(${x}px, ${y}px)` }}
          animate={{ y: [y, y - 8, y] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}40`, boxShadow: `0 0 16px ${color}20` }}>
            <Icon size={16} color={color} />
          </div>
          <span style={{ fontSize: 9, color: C.slateLight, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        </motion.div>
      ))}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {[
          { x1: '50%', y1: '50%', x2: '22%', y2: '30%' },
          { x1: '50%', y1: '50%', x2: '78%', y2: '33%' },
          { x1: '50%', y1: '50%', x2: '25%', y2: '72%' },
          { x1: '50%', y1: '50%', x2: '75%', y2: '70%' },
        ].map((line, i) => (
          <motion.line key={i} {...line}
            stroke={i % 2 === 0 ? C.cyan : C.emerald} strokeWidth="0.5" strokeDasharray="4 4"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </svg>
    </div>
  )
}

function LiveTicker() {
  const items = [
    { label: 'Sales Today',        value: '847',    unit: 'tx',   color: C.emerald },
    { label: 'Revenue',            value: '24,391', unit: 'MAD',  color: C.cyan    },
    { label: 'Low Stock Alerts',   value: '3',      unit: 'items',color: '#F59E0B' },
    { label: 'Medications Tracked',value: '1,204',  unit: 'SKUs', color: C.emerald },
    { label: 'Uptime',             value: '99.97',  unit: '%',    color: C.cyan    },
    { label: 'Transactions/min',   value: '12.4',   unit: 'avg',  color: C.emerald },
  ]
  const doubled = [...items, ...items]

  return (
    <div className="w-full overflow-hidden py-3 relative"
      style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
      <div className="absolute left-0 top-0 h-full w-20 z-10"
        style={{ background: `linear-gradient(to right, ${C.surface}, transparent)` }} />
      <div className="absolute right-0 top-0 h-full w-20 z-10"
        style={{ background: `linear-gradient(to left, ${C.surface}, transparent)` }} />
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full"
              style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            <span style={{ fontSize: 12, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {item.label}
            </span>
            <span style={{ fontSize: 13, color: item.color, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
              {item.value}
              <span style={{ fontSize: 10, color: C.slate, marginLeft: 3 }}>{item.unit}</span>
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function BentoCard({ icon: Icon, title, description, accent, children, delay = 0, colSpan = 1 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const col = colSpan === 2 ? 'md:col-span-2' : ''

  return (
    <motion.div ref={ref} className={`relative rounded-2xl overflow-hidden ${col}`}
      style={{ background: `linear-gradient(135deg, ${C.panel} 0%, ${C.surface} 100%)`, border: `1px solid ${C.border}` }}
      variants={fadeUp} custom={delay} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      whileHover={{ borderColor: accent + '60', boxShadow: `0 0 40px ${accent}18`, transition: { duration: 0.3 } }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
        style={{ background: `radial-gradient(circle at top right, ${accent}, transparent)` }} />
      <div className="p-6 h-full flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
            <Icon size={20} color={accent} />
          </div>
          <div style={{ fontSize: 13, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
            {title}
          </div>
        </div>
        <p style={{ fontSize: 14, color: C.slateLight, lineHeight: 1.7 }}>{description}</p>
        {children && <div className="mt-auto">{children}</div>}
      </div>
    </motion.div>
  )
}

function Sparkline({ data, color }) {
  const max = Math.max(...data), min = Math.min(...data)
  const w = 160, h = 40
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / (max - min || 1)) * h
        return i === data.length - 1
          ? <circle key={i} cx={x} cy={y} r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          : null
      })}
    </svg>
  )
}

function StatCounter({ value, label, unit = '', color }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 60, damping: 20 })
  const [display, setDisplay] = useState(0)

  useEffect(() => { if (inView) mv.set(value) }, [inView])
  useEffect(() => spring.onChange(v => setDisplay(Math.round(v))), [spring])

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>
        {display.toLocaleString()}{unit}
      </div>
      <div style={{ fontSize: 12, color: C.slate, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

function Nav({ onEnterApp }) {
  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{ background: `${C.obsidian}CC`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}` }}
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.cyanDim}, ${C.emeraldDim})`, border: `1px solid ${C.cyan}40` }}>
          <FlaskConical size={16} color={C.cyan} />
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: C.white, fontSize: 15 }}>
          Pharma<span style={{ color: C.cyan }}>Manager</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'Analytics', 'Security', 'Pricing'].map(l => (
          <a key={l} href="#" style={{ fontSize: 13, color: C.slate }}>{l}</a>
        ))}
      </div>
      <button onClick={onEnterApp} className="flex items-center gap-2 px-4 py-2 rounded-xl"
        style={{ background: `linear-gradient(135deg, ${C.cyanDim}80, ${C.emeraldDim}80)`, border: `1px solid ${C.cyan}40`, color: C.cyan, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
        Launch App <ArrowRight size={14} />
      </button>
    </motion.nav>
  )
}

export default function LandingPage({ onEnterApp }) {
  const salesData  = [12, 19, 14, 28, 22, 35, 31, 42, 38, 51, 44, 58]
  const stockData  = [90, 85, 78, 82, 74, 68, 72, 65, 70, 62, 58, 55]

  return (
    <div style={{ background: C.obsidian, minHeight: '100vh', fontFamily: "'Syne', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: ${C.cyan}40; }
        a { text-decoration: none; transition: color 0.2s; }
        a:hover { color: ${C.white} !important; }
      `}</style>

      <Nav onEnterApp={onEnterApp} />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: '48px 48px', opacity: 0.4,
        }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.cyan}0D 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <motion.div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full"
              style={{ background: `${C.cyan}12`, border: `1px solid ${C.cyan}30` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="w-1.5 h-1.5 rounded-full"
                style={{ background: C.emerald, boxShadow: `0 0 6px ${C.emerald}` }} />
              <span style={{ fontSize: 11, color: C.cyan, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                v1.0 — Production Ready
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(38px, 5vw, 68px)', fontWeight: 800, lineHeight: 1.05, color: C.white, letterSpacing: '-0.03em' }}>
              Pharmacy ops,{' '}
              <span style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.emerald})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                engineered
              </span>{' '}for precision.
            </motion.h1>

            <motion.p variants={fadeUp} custom={1} initial="hidden" animate="visible"
              style={{ fontSize: 17, color: C.slateLight, lineHeight: 1.8, maxWidth: 480 }}>
              Real-time stock management, atomic sale transactions, and clinical-grade analytics.
              Built for pharmacies that refuse to compromise.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" variants={fadeUp} custom={2} initial="hidden" animate="visible">
              <button onClick={onEnterApp} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
                style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.emerald})`, color: C.obsidian, fontFamily: "'DM Mono', monospace", fontSize: 14, boxShadow: `0 0 40px ${C.cyan}40` }}>
                Open Dashboard <Zap size={15} />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl"
                style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.slateLight, fontFamily: "'DM Mono', monospace", fontSize: 14 }}>
                View API Docs <ChevronRight size={15} />
              </button>
            </motion.div>

            <motion.div className="flex gap-8" variants={fadeUp} custom={3} initial="hidden" animate="visible">
              {[{ label: 'Medications', value: '1,200+' }, { label: 'Daily Sales', value: '800+' }, { label: 'Uptime', value: '99.9%' }].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 600, color: C.white }}>{value}</div>
                  <div style={{ fontSize: 11, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div className="relative h-96 md:h-[480px]"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <HeroGraphic />
          </motion.div>
        </div>
      </section>

      <LiveTicker />

      {/* BENTO FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div style={{ fontSize: 11, color: C.cyan, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>
            Platform Features
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: C.white, letterSpacing: '-0.03em' }}>
            Every tool your pharmacy needs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BentoCard icon={Activity} title="Live Sales Engine" accent={C.cyan} delay={0} colSpan={2}
            description="Atomic transactions snapshot the unit price at sale time. Stock deducted instantly. Cancellations restore inventory in a single DB transaction.">
            <div className="flex items-end gap-4 mt-2">
              <Sparkline data={salesData} color={C.cyan} />
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, color: C.cyan, fontWeight: 700 }}>+34%</div>
                <div style={{ fontSize: 11, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.08em' }}>vs last month</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={Bell} title="Low-Stock Alerts" accent="#F59E0B" delay={1}
            description="Configurable threshold triggers real-time alerts before you run out.">
            <div className="flex flex-col gap-2 mt-2">
              {['Amoxicillin 500mg', 'Ibuprofen 400mg', 'Metformin 1g'].map((name, i) => (
                <div key={name} className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: '#F59E0B10', border: '1px solid #F59E0B25' }}>
                  <span style={{ fontSize: 12, color: C.slateLight }}>{name}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#F59E0B' }}>{[3, 7, 5][i]} left</span>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard icon={Package} title="Smart Inventory" accent={C.emerald} delay={2}
            description="Soft-delete preserves historical records. PROTECT constraints prevent orphaned data.">
            <div className="flex items-end gap-4 mt-2">
              <Sparkline data={stockData} color={C.emerald} />
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 24, color: C.emerald, fontWeight: 700 }}>1,204</div>
                <div style={{ fontSize: 11, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.08em' }}>SKUs tracked</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard icon={BarChart3} title="Clinical Analytics" accent={C.cyan} delay={3} colSpan={2}
            description="Revenue aggregation and KPI dashboard powered by Django ORM aggregates — not client-side computation.">
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[
                { label: 'Revenue / day', value: '24,391', color: C.cyan    },
                { label: 'Avg sale size', value: '287',    color: C.emerald },
                { label: 'Transactions', value: '847',     color: C.cyan    },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, color, fontWeight: 700 }}>{value}</div>
                  <div style={{ fontSize: 11, color: C.slate }}>{label}</div>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard icon={Lock}   title="Clean Architecture" accent={C.emerald} delay={4} description="Service layer isolates business logic. Views stay thin. Atomic DB transactions on every mutation." />
          <BentoCard icon={Cpu}    title="OpenAPI Docs"        accent={C.cyan}    delay={5} description="Every endpoint documented with @extend_schema, live Swagger UI, and realistic request examples." />
          <BentoCard icon={Globe}  title="REST API"            accent={C.emerald} delay={6} description="Full CRUD with correct HTTP codes: 201 for create, 204 for delete, 400 for validation, 404 for missing." />
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-12"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { value: 1204,  label: 'Medications',         color: C.cyan    },
              { value: 847,   label: 'Daily Transactions',  color: C.emerald },
              { value: 99,    label: 'Uptime %', unit: '.9',color: C.cyan    },
              { value: 24391, label: 'MAD Revenue / day',   color: C.emerald },
            ].map(({ value, label, color, unit = '' }) => (
              <motion.div key={label} variants={fadeUp}>
                <StatCounter value={value} label={label} unit={unit} color={color} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${C.cyan}0F 0%, transparent 70%)` }} />
        <motion.div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-8"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: C.white, letterSpacing: '-0.03em' }}>
            Ready to run your pharmacy smarter?
          </motion.h2>
          <motion.button variants={fadeUp} custom={1} onClick={onEnterApp}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold"
            style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.emerald})`, color: C.obsidian, fontFamily: "'DM Mono', monospace", boxShadow: `0 0 60px ${C.cyan}40` }}
            whileHover={{ scale: 1.03, boxShadow: `0 0 80px ${C.cyan}60` }}
            whileTap={{ scale: 0.98 }}>
            Open Dashboard <ArrowRight size={18} />
          </motion.button>
          <motion.p variants={fadeUp} custom={2} style={{ fontSize: 13, color: C.slate }}>
            No setup needed · API docs at /api/docs/ · Admin at /admin/
          </motion.p>
        </motion.div>
        <div className="mt-16 pt-8 flex items-center justify-between max-w-6xl mx-auto"
          style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2">
            <FlaskConical size={14} color={C.cyan} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.slate }}>PharmaManager · SMARTHOLOL</span>
          </div>
          <span style={{ fontSize: 12, color: C.slate }}>Built with Django + React</span>
        </div>
      </section>
    </div>
  )
}