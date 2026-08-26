import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { Plus, Trash2, BookOpen, School, CheckCircle2 } from 'lucide-react';

const Subjects = () => {
  const { classes, subjects, addSubject, setSubjects } = useAppContext();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubjectName.trim() && selectedClassId) {
      addSubject(newSubjectName.trim(), selectedClassId);
      const clsName = classes.find(c => c.id === selectedClassId)?.name || '';
      showToast(`Added subject "${newSubjectName.trim()}" to ${clsName}`);
      setNewSubjectName('');
    }
  };

  const handleDeleteSubject = (id) => {
    const s = subjects.find(item => item.id === id);
    setSubjects(subjects.filter(s => s.id !== id));
    showToast(`Removed subject ${s ? s.name : ''}`);
  };

  const classSubjects = useMemo(() => {
    return subjects.filter(s => s.classId === selectedClassId);
  }, [subjects, selectedClassId]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Subject Management</h1>
          <p>Configure academic subjects for primary and higher secondary class standards.</p>
        </div>

        {toastMsg && (
          <div className="animate-scale-up" style={{
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <CheckCircle2 size={16} /> {toastMsg}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'flex-start' }}>
        {/* Class Selection & Subject Adder Card */}
        <div className="card">
          <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <School size={20} style={{ color: 'var(--color-accent)' }} /> 1. Select Class Standard
          </h3>

          <div className="input-group">
            <label style={{ fontWeight: 600 }}>Target Class Standard *</label>
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">-- Choose Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedClassId && (
            <form onSubmit={handleAddSubject} style={{ marginTop: '1.25rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-main)', display: 'block', marginBottom: '0.5rem' }}>
                Add New Subject to Class
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Subject Name (e.g. Science, Maths)" 
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  style={{ flex: 1, padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Add Subject
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Subjects List Grid */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} style={{ color: 'var(--color-accent)' }} /> Configured Subjects
            </h3>

            {selectedClassId && (
              <span className="badge badge-primary">{classSubjects.length} Active Subjects</span>
            )}
          </div>

          {!selectedClassId ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <BookOpen size={48} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
              <p>Select a class standard from the left menu to view and manage its subjects.</p>
            </div>
          ) : (
            <div>
              {classSubjects.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>
                  No subjects defined for this class yet. Use the form on the left to add subjects.
                </p>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>#</th>
                        <th>Subject Name</th>
                        <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classSubjects.map((sub, idx) => (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: 500, color: 'var(--color-text-subtle)' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600 }}>{sub.name}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              onClick={() => handleDeleteSubject(sub.id)}
                              className="btn-danger"
                              style={{ background: 'none', border: 'none', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}
                              title="Delete Subject"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
