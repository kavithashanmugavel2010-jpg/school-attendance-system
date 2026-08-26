import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, Cpu, Loader2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../store';

export default function Login() {
  const { loginWithArgon2 } = useAppContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationMetrics, setVerificationMetrics] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setVerificationMetrics(null);
    setIsLoading(true);

    try {
      const res = await loginWithArgon2(username, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Authentication failed.');
        if (res.metrics) {
          setVerificationMetrics(res.metrics);
        }
      }
    } catch (err) {
      setErrorMessage('Security authentication error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '1.5rem',
      background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%)'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        padding: '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Glow Accent Bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
        }} />

        {/* Logo and Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src="/logo.png"
                alt="School Crest"
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  padding: '3px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                backgroundColor: '#10b981',
                color: '#fff',
                borderRadius: '50%',
                padding: '4px',
                display: 'flex',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }} title="Rust Argon2 Security Active">
                <ShieldCheck size={16} />
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#ffffff' }}>
            JVK Portal Security Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            St. Joseph Vidya Kshetra - DMI Foundations
          </p>

          {/* Rust Argon2 Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#60a5fa',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            marginTop: '0.85rem'
          }}>
            <Cpu size={14} /> Rust Argon2id Security Layer Active
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Username
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0 0.85rem'
            }}>
              <User size={18} style={{ color: '#64748b', marginRight: '0.6rem' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.75rem 0',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0 0.85rem'
            }}>
              <Lock size={18} style={{ color: '#64748b', marginRight: '0.6rem' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.75rem 0',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Hashing & Verifying with Argon2...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Log In with Rust Argon2</span>
              </>
            )}
          </button>
        </form>

        {/* Verification Metrics Footer */}
        {verificationMetrics && (
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Algorithm:</span>
              <strong style={{ color: '#38bdf8' }}>{verificationMetrics.algorithm}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Execution Time:</span>
              <strong style={{ color: '#34d399' }}>{verificationMetrics.executionTimeMs} ms</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Memory Hardness:</span>
              <strong style={{ color: '#c084fc' }}>{verificationMetrics.memoryCostKb / 1024} MB RAM</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
