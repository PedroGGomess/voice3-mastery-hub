import React from 'react'
import { Link } from 'react-router-dom'

// ── LOGO ──────────────────────────────────────
export const VoiceLogo = ({ size = 22 }: { size?: number }) => (
  <Link to="/" style={{ textDecoration: 'none' }}>
    <span style={{
      fontFamily: 'var(--font-serif)',
      fontWeight: 800,
      fontSize: size,
      color: 'var(--gold)',
      letterSpacing: '0.12em',
      cursor: 'pointer',
      userSelect: 'none',
    }}>VOICE³</span>
  </Link>
)

// ── SECTION LABEL ─────────────────────────────
export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{
    fontSize: 'var(--text-xs)',
    letterSpacing: '0.14em',
    fontWeight: 700,
    color: 'var(--text-faint)',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 4,
  }}>{children}</p>
)

// ── GOLD DIVIDER ──────────────────────────────
export const GoldDivider = ({ width = 48 }: { width?: number }) => (
  <div style={{
    width,
    height: 2,
    background: 'var(--gold)',
    borderRadius: 1,
    margin: '20px 0',
  }}/>
)

// ── CARD ──────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  gold?: boolean
  hover?: boolean
  padding?: number
  style?: React.CSSProperties
  onClick?: () => void
}
export const Card = ({ children, gold, hover, padding = 24, style, onClick }: CardProps) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--bg-card)',
      border: `1px solid ${gold ? 'var(--border-gold)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding,
      transition: 'var(--transition)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    className={hover ? 'voice-card-hover' : ''}
  >{children}</div>
)

// ── BADGE / PILL ───────────────────────────────
type BadgeVariant = 'gold' | 'success' | 'error' | 'muted' | 'purple' | 'blue'
export const Badge = ({
  children, variant = 'gold', size = 'sm'
}: { children: React.ReactNode, variant?: BadgeVariant, size?: 'xs' | 'sm' | 'md' }) => {
  const colors: Record<BadgeVariant, { bg: string, color: string, border: string }> = {
    gold:    { bg: 'var(--gold-10)',        color: 'var(--gold)',        border: 'var(--border-gold)' },
    success: { bg: 'var(--success-bg)',     color: 'var(--success)',     border: 'var(--success-border)' },
    error:   { bg: 'var(--error-bg)',       color: 'var(--error)',       border: 'var(--error-border)' },
    muted:   { bg: 'rgba(255,255,255,0.05)',color: 'var(--text-muted)',  border: 'var(--border)' },
    purple:  { bg: 'rgba(139,92,246,0.10)', color: 'rgba(167,139,250,0.9)', border: 'rgba(139,92,246,0.20)' },
    blue:    { bg: 'rgba(59,130,246,0.10)', color: 'rgba(147,197,253,0.9)', border: 'rgba(59,130,246,0.20)' },
  }
  const c = colors[variant]
  const padding = size === 'xs' ? '2px 7px' : size === 'sm' ? '3px 10px' : '5px 14px'
  const fontSize = size === 'xs' ? 10 : size === 'sm' ? 11 : 13
  return (
    <span style={{
      display: 'inline-block',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 'var(--radius-full)',
      padding, fontSize, fontWeight: 600, letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  )
}

// ── BUTTON ────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold-outline'
interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
  type?: 'button' | 'submit'
}
export const VoiceButton = ({
  children, variant = 'primary', size = 'md',
  onClick, disabled, loading, fullWidth, style, type = 'button'
}: ButtonProps) => {
  const heights = { sm: 34, md: 42, lg: 52 }
  const fontSizes = { sm: 12, md: 13, lg: 15 }
  const paddings = { sm: '0 14px', md: '0 20px', lg: '0 28px' }

  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
      color: '#060f1d', border: 'none',
      boxShadow: 'var(--shadow-gold)',
    },
    secondary: {
      background: 'var(--bg-card)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'var(--error-bg)',
      color: 'var(--error)',
      border: '1px solid var(--error-border)',
    },
    'gold-outline': {
      background: 'transparent',
      color: 'var(--gold)',
      border: '1px solid var(--border-gold)',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        height: heights[size],
        padding: paddings[size],
        fontSize: fontSizes[size],
        fontWeight: 700,
        borderRadius: 'var(--radius-md)',
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        transition: 'var(--transition)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        opacity: (disabled || loading) ? 0.5 : 1,
        letterSpacing: '0.02em',
        ...styles[variant],
        ...style,
      }}
    >
      {loading && <span style={{
        width: 14, height: 14, border: '2px solid currentColor',
        borderTopColor: 'transparent', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite', flexShrink: 0,
      }}/>}
      {children}
    </button>
  )
}

// ── INPUT ─────────────────────────────────────
interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  type?: string
  disabled?: boolean
  error?: string
  style?: React.CSSProperties
}
export const VoiceInput = ({ label, placeholder, value, onChange, type = 'text', disabled, error, style }: InputProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <span style={{
        fontSize: 'var(--text-xs)', letterSpacing: '0.12em',
        fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase',
      }}>{label}</span>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      style={{
        height: 46,
        background: 'var(--bg-input)',
        border: `1px solid ${error ? 'var(--error-border)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: 'var(--text-base)',
        padding: '0 14px',
        outline: 'none',
        transition: 'var(--transition)',
        width: '100%',
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = error ? 'var(--error)' : 'rgba(201,168,76,0.5)' }}
      onBlur={e => { e.target.style.borderColor = error ? 'var(--error-border)' : 'var(--border)' }}
    />
    {error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--error)' }}>{error}</span>}
  </div>
)

// ── AVATAR ────────────────────────────────────
export const Avatar = ({ name, size = 36 }: { name: string, size?: number }) => {
  const initials = name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 800, color: '#060f1d',
      letterSpacing: '0.05em',
    }}>{initials}</div>
  )
}

// ── PROGRESS BAR ──────────────────────────────
export const ProgressBar = ({
  value, max = 100, color = 'gold', height = 5
}: { value: number, max?: number, color?: 'gold' | 'green' | 'blue', height?: number }) => {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const gradients = {
    gold:  'linear-gradient(90deg, var(--gold), var(--gold-light))',
    green: 'linear-gradient(90deg, #22c55e, #4ade80)',
    blue:  'linear-gradient(90deg, #3b82f6, #60a5fa)',
  }
  return (
    <div style={{ height, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: gradients[color],
        borderRadius: 99, transition: 'width 1s ease-out',
      }}/>
    </div>
  )
}

// ── STAT CARD ─────────────────────────────────
export const StatCard = ({
  icon, value, label, sub, trend
}: { icon: string, value: string, label: string, sub?: string, trend?: '+' | '-' | '=' }) => (
  <Card hover style={{ position: 'relative' }}>
    <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
    <div style={{
      fontSize: 28, fontWeight: 800,
      fontFamily: 'var(--font-serif)',
      color: 'var(--gold)',
      lineHeight: 1, marginBottom: 4,
    }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 3 }}>
      {label}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: trend === '+' ? 'var(--success)' : 'var(--text-faint)' }}>
        {sub}
      </div>
    )}
  </Card>
)

// ── EMPTY STATE ───────────────────────────────
export const EmptyState = ({
  icon = '📭', title, description, action
}: { icon?: string, title: string, description?: string, action?: React.ReactNode }) => (
  <div style={{
    textAlign: 'center', padding: '60px 24px',
    color: 'var(--text-muted)',
  }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
      {title}
    </h3>
    {description && <p style={{ fontSize: 14, maxWidth: 320, margin: '0 auto 20px' }}>{description}</p>}
    {action}
  </div>
)

// ── SECTION HEADER ────────────────────────────
export const SectionHeader = ({
  title, subtitle, action
}: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: subtitle ? 'flex-start' : 'center',
    marginBottom: 24,
  }}>
    <div>
      <h2 style={{
        fontSize: 22, fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: subtitle ? 4 : 0,
      }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

// ── DIVIDER ───────────────────────────────────
export const Divider = () => (
  <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }}/>
)
