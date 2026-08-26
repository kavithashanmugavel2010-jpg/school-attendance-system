import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../store';
import { Save, CheckCircle, XCircle, CheckCheck, Search } from 'lucide-react';

const Attendance = () => {
  const { classes, students, attendance, saveAttendance } = useAppContext();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClass);
  }, [students, selectedClass]);

  const filteredStudents = useMemo(() => {
    return classStudents.filter(s => !searchQuery.trim() || s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [classStudents, searchQuery]);

  // Load existing attendance record for class and date
  useEffect(() => {
    if (selectedClass && selectedDate) {
      const existingRecord = attendance.find(a => a.classId === selectedClass && a.date === selectedDate);
      if (existingRecord && existingRecord.records) {
        setRecords(existingRecord.records);
      } else {
        const initialRecords = {};
        classStudents.forEach(s => {
          initialRecords[s.id] = 'Present';
        });
        setRecords(initialRecords);
      }
    } else {
      setRecords({});
    }
  }, [selectedClass, selectedDate, attendance, classStudents]);

  const handleToggle = (studentId) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleBatchMark = (status) => {
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setRecords(updated);
  };

  const handleSave = () => {
    if (selectedClass && selectedDate) {
      saveAttendance(selectedClass, selectedDate, records);
      const clsName = classes.find(c => c.id === selectedClass)?.name || '';
      setSaveSuccessMsg(`Attendance successfully saved for ${clsName} on ${selectedDate}!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // Compute live statistics for current view
  const stats = useMemo(() => {
    const total = classStudents.length;
    let presentCount = 0;
    let absentCount = 0;
    classStudents.forEach(s => {
      if (records[s.id] === 'Absent') absentCount++;
      else presentCount++;
    });
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;
    return { total, presentCount, absentCount, percentage };
  }, [classStudents, records]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Daily Attendance Register</h1>
          <p>Record, manage, and verify daily student attendance records across classes.</p>
        </div>

        {saveSuccessMsg && (
          <div className="animate-scale-up" style={{
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <CheckCircle size={18} /> {saveSuccessMsg}
          </div>
        )}
      </div>

      {/* Class & Date Selector Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Class Standard *</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="">-- Choose Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.section || 'Primary'})</option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Attendance Date *</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Content Section */}
      {selectedClass && (
        <div>
          {/* Stats Bar */}
          <div className="grid-cards" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="card" style={{ borderLeft: '4px solid #4f46e5', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>TOTAL ENROLLED</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#1e1b4b' }}>{stats.total}</h3>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>PRESENT TODAY</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#065f46' }}>{stats.presentCount}</h3>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #ef4444', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>ABSENT TODAY</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#991b1b' }}>{stats.absentCount}</h3>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #3b82f6', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>ATTENDANCE RATE</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#1e40af' }}>{stats.percentage}%</h3>
            </div>
          </div>

          {/* Attendance Student Roster Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ margin: 0 }}>
                  Student Attendance Roster — {classes.find(c => c.id === selectedClass)?.name}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem' }}>
                  Date: <strong>{selectedDate}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleBatchMark('Present')}
                >
                  <CheckCheck size={16} /> Mark All Present
                </button>
                <button 
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleBatchMark('Absent')}
                >
                  <XCircle size={16} /> Mark All Absent
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={18} /> Save Attendance
                </button>
              </div>
            </div>

            {/* Filter Search Input */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
              <input 
                type="text"
                placeholder="Search student by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.85rem 0.5rem 2.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {classStudents.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No students enrolled in this class. Add students from the <strong>Classes & Students</strong> tab.
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Student Name</th>
                      <th style={{ width: '140px' }}>Current Status</th>
                      <th style={{ width: '180px', textAlign: 'center' }}>Toggle Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => {
                      const isPresent = (records[student.id] || 'Present') === 'Present';

                      return (
                        <tr key={student.id} style={{ backgroundColor: isPresent ? 'transparent' : '#fef2f2' }}>
                          <td style={{ fontWeight: 500, color: 'var(--color-text-subtle)' }}>{index + 1}</td>
                          <td style={{ fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isPresent ? '#ecfdf5' : '#fef2f2',
                                color: isPresent ? '#065f46' : '#991b1b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '0.78rem'
                              }}>
                                {student.name.charAt(0)}
                              </div>
                              <span>{student.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${isPresent ? 'badge-success' : 'badge-danger'}`}>
                              {isPresent ? <><CheckCircle size={14} /> Present</> : <><XCircle size={14} /> Absent</>}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              className="btn btn-sm"
                              style={{
                                backgroundColor: isPresent ? '#fef2f2' : '#ecfdf5',
                                color: isPresent ? '#991b1b' : '#065f46',
                                border: isPresent ? '1px solid #fecaca' : '1px solid #a7f3d0',
                                width: '140px'
                              }}
                              onClick={() => handleToggle(student.id)}
                            >
                              {isPresent ? (
                                <><XCircle size={14} /> Mark Absent</>
                              ) : (
                                <><CheckCircle size={14} /> Mark Present</>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
