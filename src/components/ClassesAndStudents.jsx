import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../store';
import { Plus, Trash2, Users, Search, UserCheck, School, Sparkles, CheckCircle2, Filter } from 'lucide-react';

const ClassesAndStudents = () => {
  const { classes, addClass, setClasses, students, addStudent, setStudents } = useAppContext();
  const [newClassName, setNewClassName] = useState('');
  const [newClassSection, setNewClassSection] = useState('Primary');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Auto select first class if available
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (newClassName.trim()) {
      addClass(newClassName.trim(), newClassSection);
      showToast(`Added class ${newClassName.trim()} to ${newClassSection}`);
      setNewClassName('');
    }
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (newStudentName.trim() && selectedClassId) {
      addStudent(newStudentName.trim(), selectedClassId);
      const clsName = classes.find(c => c.id === selectedClassId)?.name || '';
      showToast(`Enrolled student "${newStudentName.trim()}" in ${clsName}`);
      setNewStudentName('');
    }
  };

  const handleDeleteClass = (id) => {
    const clsName = classes.find(c => c.id === id)?.name || '';
    setClasses(classes.filter(c => c.id !== id));
    setStudents(students.filter(s => s.classId !== id)); // cascading delete
    if (selectedClassId === id) setSelectedClassId(null);
    showToast(`Deleted class ${clsName}`);
  };

  const handleDeleteStudent = (id) => {
    const s = students.find(item => item.id === id);
    setStudents(students.filter(item => item.id !== id));
    showToast(`Removed student ${s ? s.name : ''}`);
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const selectedClassStudents = useMemo(() => {
    return students.filter(s => {
      const matchesClass = s.classId === selectedClassId;
      const matchesSearch = !studentSearchQuery.trim() || s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [students, selectedClassId, studentSearchQuery]);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Classes & Student Roster</h1>
          <p>Organize school standards, manage sections, and enroll students into classes.</p>
        </div>

        {toastMessage && (
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
            gap: '0.4rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <CheckCircle2 size={16} /> {toastMessage}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'flex-start' }}>
        {/* Classes List Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <School size={20} style={{ color: 'var(--color-accent)' }} /> School Classes
            </h3>
            <span className="badge badge-primary">{classes.length} Total</span>
          </div>

          {/* Add Class Form */}
          <form onSubmit={handleAddClass} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Create New Class</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Class Name (e.g., Grade 10 - A)" 
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                style={{ flex: 2, minWidth: '130px', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              />
              <select 
                value={newClassSection}
                onChange={(e) => setNewClassSection(e.target.value)}
                style={{ flex: 1, minWidth: '120px', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              >
                <option value="Primary">Primary</option>
                <option value="Higher Secondary">Higher Secondary</option>
                <option value="Senior Higher Secondary">Senior Higher Secondary</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Plus size={16} /> Add Class
            </button>
          </form>

          {/* Classes grouped by Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {classes.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem 0' }}>No classes created yet.</p>
            ) : null}
            
            {['Primary', 'Higher Secondary', 'Senior Higher Secondary'].map(section => {
              const sectionClasses = classes.filter(c => c.section === section || (!c.section && section === 'Primary'));
              if (sectionClasses.length === 0) return null;
              
              return (
                <div key={section}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {section}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)' }}>{sectionClasses.length} Classes</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {sectionClasses.map(c => {
                      const count = students.filter(s => s.classId === c.id).length;
                      const isSelected = selectedClassId === c.id;

                      return (
                        <div 
                          key={c.id}
                          style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            backgroundColor: isSelected ? '#eef2ff' : '#ffffff',
                            border: isSelected ? '1.5px solid #6366f1' : '1px solid var(--border-color)',
                            boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.15)' : 'none',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setSelectedClassId(c.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? '#4338ca' : '#f1f5f9',
                              color: isSelected ? '#ffffff' : 'var(--color-text-main)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem'
                            }}>
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#1e1b4b' : 'var(--color-text-main)' }}>{c.name}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span className={`badge ${isSelected ? 'badge-primary' : 'badge-info'}`} style={{ fontSize: '0.72rem' }}>
                              {count} student{count === 1 ? '' : 's'}
                            </span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteClass(c.id); }}
                              className="btn-danger"
                              style={{ background: 'none', border: 'none', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }}
                              title="Delete Class"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Students List Card */}
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} style={{ color: 'var(--color-accent)' }} /> 
              {selectedClass ? `Students in ${selectedClass.name}` : 'Select a Class'}
            </h3>

            {selectedClass && (
              <span className="badge badge-success">
                {selectedClassStudents.length} Active Enrollment{selectedClassStudents.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
          
          {!selectedClassId ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <School size={48} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
              <p>Please select a class from the left menu to view and enroll students.</p>
            </div>
          ) : (
            <>
              {/* Add Student Form */}
              <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Student Full Name" 
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <button type="submit" className="btn btn-accent">
                  <Plus size={16} /> Enroll Student
                </button>
              </form>

              {/* Student Search Filter */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input 
                  type="text"
                  placeholder="Filter student list..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Students Data Table */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Student Avatar & Name</th>
                      <th>Class Tag</th>
                      <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClassStudents.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                          No students found matching your search.
                        </td>
                      </tr>
                    ) : null}
                    {selectedClassStudents.map((student, idx) => (
                      <tr key={student.id}>
                        <td style={{ fontWeight: 500, color: 'var(--color-text-subtle)' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.78rem'
                            }}>
                              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span>{student.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">{selectedClass.name}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
                            className="btn-danger"
                            style={{ background: 'none', border: 'none', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}
                            title="Delete Student"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassesAndStudents;
