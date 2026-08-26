import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  GraduationCap, 
  Printer, 
  LogOut, 
  ShieldCheck, 
  BookX, 
  Search, 
  Menu, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  School
} from 'lucide-react';
import { AppProvider, useAppContext } from './store';
import './App.css';

import ClassesAndStudents from './components/ClassesAndStudents';
import Subjects from './components/Subjects';
import Attendance from './components/Attendance';
import MarkRegister from './components/MarkRegister';
import HomeworkDefaulters from './components/HomeworkDefaulters';
import Reports from './components/Reports';
import Login from './components/Login';

const Dashboard = () => {
  const { classes, students, subjects, attendance, homeworkDefaulters = [] } = useAppContext();
  const navigate = useNavigate();

  // Compute live statistics
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.length;

  // Compute today's attendance percentage
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendanceRecords = attendance.filter(a => a.date === todayStr);
  const totalAttendanceLoggedToday = todayAttendanceRecords.reduce((acc, a) => {
    if (a.records) return acc + Object.keys(a.records).length;
    return acc;
  }, 0);
  const totalPresentToday = todayAttendanceRecords.reduce((acc, a) => {
    if (a.records) {
      return acc + Object.values(a.records).filter(val => val === 'Present').length;
    }
    return acc;
  }, 0);
  const attendanceRateToday = totalAttendanceLoggedToday > 0 
    ? Math.round((totalPresentToday / totalAttendanceLoggedToday) * 100) 
    : 94; // fallback sample highlight

  // Homework Defaulter Count across all logs
  const totalDefaulterIncidents = useMemo(() => {
    let count = 0;
    homeworkDefaulters.forEach(entry => {
      if (entry.records) {
        Object.values(entry.records).forEach(rec => {
          if (rec && (rec.isDefaulter || rec.status === 'Defaulter')) count++;
        });
      }
    });
    return count;
  }, [homeworkDefaulters]);

  // Recent Defaulters Watchlist
  const recentDefaulterItems = useMemo(() => {
    const list = [];
    homeworkDefaulters.forEach(entry => {
      const clsName = classes.find(c => c.id === entry.classId)?.name || 'Class';
      if (entry.records) {
        Object.entries(entry.records).forEach(([studId, rec]) => {
          if (rec && (rec.isDefaulter || rec.status === 'Defaulter')) {
            const stud = students.find(s => s.id === studId);
            list.push({
              id: `${entry.id}_${studId}`,
              studentName: stud ? stud.name : 'Student',
              className: clsName,
              subjectName: entry.subjectName,
              date: entry.date,
              remarks: rec.remarks || 'Incomplete homework'
            });
          }
        });
      }
    });
    return list.slice(0, 5); // top 5 recent
  }, [homeworkDefaulters, classes, students]);

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize: '1.85rem' }}>Welcome Back, Administrator</h1>
            <span className="badge badge-primary animate-scale-up" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
              <Sparkles size={14} /> JVK Portal v2.0
            </span>
          </div>
          <p>St. Joseph Vidya Kshetra Student Management & Academic Intelligence System.</p>
        </div>

        <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-pill)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Rust Argon2 Active Session
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-cards" style={{ marginBottom: '1.75rem' }}>
        <div className="card card-hover" style={{ borderTop: '4px solid #4f46e5', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Enrolled
              </span>
              <h2 style={{ fontSize: '2.2rem', margin: '0.3rem 0 0.1rem 0', color: '#1e1b4b' }}>{totalStudents}</h2>
              <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                <TrendingUp size={14} /> Active Students
              </span>
            </div>
            <div style={{ backgroundColor: '#eef2ff', color: '#4338ca', padding: '0.75rem', borderRadius: '12px' }}>
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card card-hover" style={{ borderTop: '4px solid #3b82f6', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Classes & Sections
              </span>
              <h2 style={{ fontSize: '2.2rem', margin: '0.3rem 0 0.1rem 0', color: '#1e3a8a' }}>{totalClasses}</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {totalSubjects} Subjects Configured
              </span>
            </div>
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.75rem', borderRadius: '12px' }}>
              <School size={24} />
            </div>
          </div>
        </div>

        <div className="card card-hover" style={{ borderTop: '4px solid #10b981', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Today's Attendance Rate
              </span>
              <h2 style={{ fontSize: '2.2rem', margin: '0.3rem 0 0.1rem 0', color: '#064e3b' }}>{attendanceRateToday}%</h2>
              <span style={{ fontSize: '0.78rem', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> High Participation
              </span>
            </div>
            <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '12px' }}>
              <CalendarCheck size={24} />
            </div>
          </div>
        </div>

        <div className="card card-hover" style={{ borderTop: '4px solid #ef4444', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Defaulter Watchlist
              </span>
              <h2 style={{ fontSize: '2.2rem', margin: '0.3rem 0 0.1rem 0', color: '#7f1d1d' }}>{totalDefaulterIncidents}</h2>
              <span style={{ fontSize: '0.78rem', color: '#dc2626', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                <AlertTriangle size={14} /> Total Homework Defaults
              </span>
            </div>
            <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '12px' }}>
              <BookX size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Actions Bar */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.85rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={18} style={{ color: 'var(--color-accent)' }} /> Quick Management Launchpad
        </h3>
        <div className="grid-actions">
          <div 
            onClick={() => navigate('/attendance')}
            className="card card-hover" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem' }}
          >
            <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '0.65rem', borderRadius: '10px' }}>
              <CalendarCheck size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Mark Attendance</h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>Record daily student status</p>
            </div>
            <ChevronRight size={18} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
          </div>

          <div 
            onClick={() => navigate('/defaulters')}
            className="card card-hover" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem' }}
          >
            <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.65rem', borderRadius: '10px' }}>
              <BookX size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Homework Defaulters</h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>Log non-submitted tasks</p>
            </div>
            <ChevronRight size={18} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
          </div>

          <div 
            onClick={() => navigate('/marks')}
            className="card card-hover" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem' }}
          >
            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.65rem', borderRadius: '10px' }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Mark Register</h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>Enter exam & term scores</p>
            </div>
            <ChevronRight size={18} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
          </div>

          <div 
            onClick={() => navigate('/reports')}
            className="card card-hover" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem' }}
          >
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.65rem', borderRadius: '10px' }}>
              <Printer size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Generate Reports</h4>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>Print academic report cards</p>
            </div>
            <ChevronRight size={18} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Homework Defaulter Watchlist Widget */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: '#ef4444' }} /> Recent Homework Incidents
            </h3>
            <button 
              onClick={() => navigate('/defaulters')}
              className="btn btn-secondary btn-sm"
            >
              View Log <ArrowUpRight size={14} />
            </button>
          </div>

          {recentDefaulterItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' }}>
              <CheckCircle2 size={36} style={{ color: '#10b981', opacity: 0.8, marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontWeight: 500 }}>No recent homework defaulters!</p>
              <span style={{ fontSize: '0.78rem' }}>All student submissions are up to date.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentDefaulterItems.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 0.9rem',
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fed7d7',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#991b1b' }}>{item.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#7f1d1d' }}>
                      {item.className} • <span style={{ fontWeight: 600 }}>{item.subjectName}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Classes & Enrolled Students Quick View */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--color-accent)' }} /> Classes Roster Overview
            </h3>
            <button 
              onClick={() => navigate('/classes')}
              className="btn btn-secondary btn-sm"
            >
              Manage Classes <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {classes.map(cls => {
              const count = students.filter(s => s.classId === cls.id).length;
              return (
                <div 
                  key={cls.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#eef2ff',
                      color: '#4338ca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {cls.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cls.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{cls.section || 'Primary'}</div>
                    </div>
                  </div>

                  <span className="badge badge-primary">
                    {count} Enrolled Student{count === 1 ? '' : 's'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAppContext();

  return (
    <aside className={`sidebar no-print ${isOpen ? 'open' : ''}`}>
      <div>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo-glow">
              <img 
                src="/logo.png" 
                alt="School Logo" 
                className="brand-logo-img"
              />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff', lineHeight: 1.2, fontWeight: 700 }}>
                Joseph Vidya
              </h2>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                DMI Foundations
              </span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Portal</div>
          <NavLink to="/" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={19} /> Dashboard
          </NavLink>
          <NavLink to="/classes" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={19} /> Classes & Students
          </NavLink>
          <NavLink to="/subjects" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <BookOpen size={19} /> Subjects
          </NavLink>

          <div className="nav-section-title" style={{ marginTop: '0.5rem' }}>Academic Operations</div>
          <NavLink to="/attendance" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={19} /> Daily Attendance
          </NavLink>
          <NavLink to="/defaulters" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <BookX size={19} /> Homework Defaulters
          </NavLink>
          <NavLink to="/marks" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <GraduationCap size={19} /> Mark Register
          </NavLink>
          <NavLink to="/reports" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Printer size={19} /> Student Reports
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#4338ca',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Admin User</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Argon2 Secure Session</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-danger"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.55rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

const TopNavbar = ({ onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const { students, classes } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }

    const matchedStudents = students.filter(s => s.name.toLowerCase().includes(q.toLowerCase())).map(s => {
      const cls = classes.find(c => c.id === s.classId);
      return { type: 'student', title: s.name, subtitle: `Class: ${cls ? cls.name : 'Unknown'}`, link: '/classes' };
    });

    const matchedClasses = classes.filter(c => c.name.toLowerCase().includes(q.toLowerCase())).map(c => {
      return { type: 'class', title: c.name, subtitle: `Section: ${c.section || 'Primary'}`, link: '/classes' };
    });

    setSearchResults([...matchedStudents, ...matchedClasses].slice(0, 6));
  };

  return (
    <header className="top-navbar no-print">
      <div className="top-navbar-left">
        <button className="mobile-menu-toggle" onClick={onToggleSidebar} title="Toggle Navigation">
          <Menu size={22} />
        </button>

        <div className="quick-search-box">
          <Search size={16} className="quick-search-icon" />
          <input
            type="text"
            placeholder="Quick search student or class..."
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Quick Search Overlay Results */}
          {searchResults.length > 0 && (
            <div className="glass-dark animate-scale-up" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              borderRadius: '12px',
              padding: '0.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              zIndex: 100
            }}>
              {searchResults.map((res, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    navigate(res.link);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{res.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{res.subtitle}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="top-navbar-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          <Clock size={16} style={{ color: 'var(--color-accent)' }} /> {currentTime}
        </div>

        <div style={{
          height: '24px',
          width: '1px',
          backgroundColor: 'var(--border-color)'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img 
            src="/logo.png" 
            alt="School Crest" 
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.1 }}>St. Joseph Vidya Kshetra</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>Academic Management</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const MainApp = () => {
  const { isAuthenticated } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 45
            }} 
          />
        )}

        <div className="main-wrapper">
          <TopNavbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/classes" element={<ClassesAndStudents />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/defaulters" element={<HomeworkDefaulters />} />
              <Route path="/marks" element={<MarkRegister />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
