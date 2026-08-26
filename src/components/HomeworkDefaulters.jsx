import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../store';
import { 
  BookX, 
  Save, 
  CheckCircle, 
  XCircle, 
  Search, 
  Trash2, 
  Printer, 
  FileSpreadsheet, 
  UserX, 
  AlertTriangle,
  PlusCircle,
  Calendar,
  CheckCheck,
  Sparkles,
  Filter
} from 'lucide-react';

const HomeworkDefaulters = () => {
  const { 
    classes, 
    students, 
    subjects, 
    homeworkDefaulters, 
    saveHomeworkDefaulters, 
    deleteHomeworkDefaulter 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('entry'); // 'entry' | 'history' | 'student-summary'
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjectMode, setSubjectMode] = useState('select'); // 'select' | 'custom'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [homeworkTopic, setHomeworkTopic] = useState('');
  const [records, setRecords] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // History / Filter state
  const [historyClassFilter, setHistoryClassFilter] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');

  // Filter students for the selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClass);
  }, [students, selectedClass]);

  // Filter subjects for the selected class
  const classSubjects = useMemo(() => {
    return subjects.filter(s => s.classId === selectedClass);
  }, [subjects, selectedClass]);

  // Effective Subject Name
  const effectiveSubjectName = subjectMode === 'custom' ? customSubject.trim() : selectedSubject;

  // Auto select first class if none selected
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  // Load existing entry if available when class, date, or subject changes
  useEffect(() => {
    if (selectedClass && selectedDate && effectiveSubjectName) {
      const existing = homeworkDefaulters.find(
        hd => hd.classId === selectedClass && 
              hd.date === selectedDate && 
              hd.subjectName.toLowerCase() === effectiveSubjectName.toLowerCase()
      );

      if (existing && existing.records) {
        setRecords(existing.records);
        if (existing.topic) setHomeworkTopic(existing.topic);
      } else {
        // Default all students to 'Completed' (Not Defaulter)
        const initial = {};
        classStudents.forEach(s => {
          initial[s.id] = {
            isDefaulter: false,
            status: 'Completed',
            remarks: ''
          };
        });
        setRecords(initial);
      }
    } else {
      setRecords({});
    }
  }, [selectedClass, selectedDate, effectiveSubjectName, homeworkDefaulters, classStudents]);

  const handleToggleStatus = (studentId) => {
    setRecords(prev => {
      const current = prev[studentId] || { isDefaulter: false, status: 'Completed', remarks: '' };
      const nextIsDefaulter = !current.isDefaulter;
      return {
        ...prev,
        [studentId]: {
          ...current,
          isDefaulter: nextIsDefaulter,
          status: nextIsDefaulter ? 'Defaulter' : 'Completed'
        }
      };
    });
  };

  const handleRemarksChange = (studentId, remarksValue) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { isDefaulter: false, status: 'Completed' }),
        remarks: remarksValue
      }
    }));
  };

  const handleMarkAll = (isDefaulter) => {
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = {
        isDefaulter: isDefaulter,
        status: isDefaulter ? 'Defaulter' : 'Completed',
        remarks: records[s.id]?.remarks || ''
      };
    });
    setRecords(updated);
  };

  const handleSave = () => {
    if (!selectedClass) {
      alert('Please select a Class.');
      return;
    }
    if (!selectedDate) {
      alert('Please select a Date.');
      return;
    }
    if (!effectiveSubjectName) {
      alert('Please select or type a Subject Name.');
      return;
    }

    saveHomeworkDefaulters(selectedClass, selectedDate, effectiveSubjectName, homeworkTopic, records);
    setSaveSuccessMsg(`Homework defaulter record saved for ${effectiveSubjectName} on ${selectedDate}!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Analytics calculation
  const analytics = useMemo(() => {
    const totalEntries = homeworkDefaulters.length;
    let totalDefaulterIncidents = 0;
    const studentDefaulterMap = {};
    const subjectDefaulterMap = {};

    homeworkDefaulters.forEach(entry => {
      const subj = entry.subjectName || 'Unknown';
      if (!subjectDefaulterMap[subj]) subjectDefaulterMap[subj] = 0;

      if (entry.records) {
        Object.entries(entry.records).forEach(([studId, rec]) => {
          if (rec && (rec.isDefaulter || rec.status === 'Defaulter')) {
            totalDefaulterIncidents++;
            studentDefaulterMap[studId] = (studentDefaulterMap[studId] || 0) + 1;
            subjectDefaulterMap[subj]++;
          }
        });
      }
    });

    let topSubject = 'N/A';
    let maxSubjCount = 0;
    Object.entries(subjectDefaulterMap).forEach(([subj, count]) => {
      if (count > maxSubjCount) {
        maxSubjCount = count;
        topSubject = subj;
      }
    });

    return {
      totalEntries,
      totalDefaulterIncidents,
      studentDefaulterMap,
      topSubject
    };
  }, [homeworkDefaulters]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    return homeworkDefaulters.filter(item => {
      const matchesClass = !historyClassFilter || item.classId === historyClassFilter;
      const className = classes.find(c => c.id === item.classId)?.name || '';
      const matchesSearch = !historySearchQuery || 
        className.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.subjectName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
        item.date.includes(historySearchQuery) ||
        (item.topic && item.topic.toLowerCase().includes(historySearchQuery.toLowerCase()));

      return matchesClass && matchesSearch;
    });
  }, [homeworkDefaulters, historyClassFilter, historySearchQuery, classes]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header no-print">
        <div>
          <h1>Homework Defaulters Management</h1>
          <p>Record, audit, and analyze student homework non-submissions across subjects.</p>
        </div>

        {/* Sub Navigation Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'entry' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('entry')}
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            <PlusCircle size={15} /> Record Defaulters
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('history')}
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            <FileSpreadsheet size={15} /> Log History ({homeworkDefaulters.length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'student-summary' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('student-summary')}
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            <UserX size={15} /> Student Risk Analytics
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="animate-scale-up" style={{
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          padding: '0.75rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid #a7f3d0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 600
        }}>
          <CheckCircle size={20} /> {saveSuccessMsg}
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid-cards no-print" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL SAVED LOGS</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.2rem 0 0 0', color: '#1e40af' }}>{analytics.totalEntries}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Recorded homework sessions</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL DEFAULTS</span>
          <h2 style={{ fontSize: '1.8rem', margin: '0.2rem 0 0 0', color: '#991b1b' }}>{analytics.totalDefaulterIncidents}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Non-submitted assignments</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>TOP DEFAULTER SUBJECT</span>
          <h2 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0 0', color: '#92400e' }}>{analytics.topSubject}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Highest default rate</span>
        </div>
      </div>

      {/* TAB 1: RECORD ENTRY */}
      {activeTab === 'entry' && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              1. Session & Subject Parameters
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {/* Class Select */}
              <div className="input-group">
                <label style={{ fontWeight: 600 }}>Select Class *</label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedSubject('');
                  }}
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Select */}
              <div className="input-group">
                <label style={{ fontWeight: 600 }}>Select Date *</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* Subject Mode Selector */}
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontWeight: 600 }}>Subject *</label>
                  <button 
                    type="button"
                    onClick={() => setSubjectMode(prev => prev === 'select' ? 'custom' : 'select')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {subjectMode === 'select' ? '+ Type Custom' : '← Select Existing'}
                  </button>
                </div>

                {subjectMode === 'select' ? (
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedClass}
                  >
                    <option value="">-- Choose Subject --</option>
                    {classSubjects.map(sub => (
                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    type="text" 
                    placeholder="Type subject name (e.g. Maths, Science)"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                  />
                )}

                {/* Quick Subject Select Pills */}
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Quick Select Subject:</span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {['L1', 'L2', 'L3', 'Maths', 'Science', 'Social', 'Computer Science'].map(subj => (
                      <button
                        key={subj}
                        type="button"
                        style={{
                          padding: '0.2rem 0.55rem',
                          fontSize: '0.72rem',
                          backgroundColor: effectiveSubjectName === subj ? '#4338ca' : '#f1f5f9',
                          color: effectiveSubjectName === subj ? '#ffffff' : 'var(--color-text-main)',
                          border: '1px solid ' + (effectiveSubjectName === subj ? '#4338ca' : 'var(--border-color)'),
                          borderRadius: 'var(--radius-pill)',
                          cursor: 'pointer',
                          fontWeight: effectiveSubjectName === subj ? 600 : 400
                        }}
                        onClick={() => {
                          setSubjectMode('select');
                          setSelectedSubject(subj);
                        }}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Homework Description / Topic */}
            <div className="input-group" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
              <label style={{ fontWeight: 600 }}>Homework Topic / Details (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Chapter 4 Exercise 4.2 Q1 to Q10, Page 85 Notebook Submission"
                value={homeworkTopic}
                onChange={(e) => setHomeworkTopic(e.target.value)}
              />
            </div>
          </div>

          {/* Student Defaulter List */}
          {selectedClass && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h3 style={{ margin: 0 }}>
                    Students List — {classes.find(c => c.id === selectedClass)?.name}
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem' }}>
                    Subject: <strong>{effectiveSubjectName || 'Not specified'}</strong> | Date: <strong>{selectedDate}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleMarkAll(false)}
                  >
                    <CheckCheck size={16} /> Mark All Completed
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleMarkAll(true)}
                  >
                    <AlertTriangle size={16} /> Mark All Defaulters
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    <Save size={18} /> Save Homework Record
                  </button>
                </div>
              </div>

              {classStudents.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No students registered in this class. Add students from the <strong>Classes & Students</strong> tab.
                </div>
              ) : (
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px' }}>#</th>
                        <th>Student Name</th>
                        <th style={{ width: '170px' }}>Submission Status</th>
                        <th style={{ width: '180px' }}>Action</th>
                        <th>Remarks / Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((student, index) => {
                        const rec = records[student.id] || { isDefaulter: false, status: 'Completed', remarks: '' };
                        const isDef = rec.isDefaulter;

                        return (
                          <tr key={student.id} style={{ backgroundColor: isDef ? '#fef2f2' : 'transparent' }}>
                            <td style={{ fontWeight: 500, color: 'var(--color-text-subtle)' }}>{index + 1}</td>
                            <td style={{ fontWeight: 600 }}>{student.name}</td>
                            <td>
                              {isDef ? (
                                <span className="badge badge-danger">
                                  <XCircle size={14} /> Homework Defaulter
                                </span>
                              ) : (
                                <span className="badge badge-success">
                                  <CheckCircle size={14} /> Completed
                                </span>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: isDef ? '#ecfdf5' : '#fef2f2',
                                  color: isDef ? '#065f46' : '#991b1b',
                                  border: isDef ? '1px solid #a7f3d0' : '1px solid #fecaca',
                                  width: '100%'
                                }}
                                onClick={() => handleToggleStatus(student.id)}
                              >
                                {isDef ? (
                                  <><CheckCircle size={14} /> Set Completed</>
                                ) : (
                                  <><XCircle size={14} /> Mark Defaulter</>
                                )}
                              </button>
                            </td>
                            <td>
                              <input 
                                type="text"
                                placeholder={isDef ? "Reason (e.g. Forgot notebook, incomplete)" : "Optional remarks"}
                                value={rec.remarks || ''}
                                onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: '6px',
                                  border: isDef ? '1px solid #fecaca' : '1px solid var(--border-color)',
                                  backgroundColor: isDef ? '#ffffff' : '#f8fafc',
                                  fontSize: '0.85rem'
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORY LOG */}
      {activeTab === 'history' && (
        <div className="card">
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
              <div className="input-group" style={{ flex: 1, minWidth: '180px', margin: 0 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Filter by Class</label>
                <select value={historyClassFilter} onChange={(e) => setHistoryClassFilter(e.target.value)}>
                  <option value="">All Classes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group" style={{ flex: 1, minWidth: '220px', margin: 0 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Search Log</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search by subject, date, topic..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.2rem', width: '100%' }}
                  />
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={18} /> Print Log Report
            </button>
          </div>

          {filteredHistory.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <BookX size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>No homework defaulter records found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredHistory.map(entry => {
                const className = classes.find(c => c.id === entry.classId)?.name || 'Class';
                const defaulterList = entry.records ? Object.entries(entry.records).filter(([_, r]) => r && (r.isDefaulter || r.status === 'Defaulter')) : [];

                return (
                  <div key={entry.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <div style={{ 
                      backgroundColor: '#f8fafc', 
                      padding: '0.85rem 1.2rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{className}</span>
                        <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>•</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{entry.subjectName}</span>
                        <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>•</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                          <Calendar size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '3px' }} />
                          {entry.date}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <span className={`badge ${defaulterList.length > 0 ? 'badge-danger' : 'badge-success'}`}>
                          {defaulterList.length} Defaulter{defaulterList.length === 1 ? '' : 's'}
                        </span>
                        <button 
                          className="no-print btn-danger"
                          onClick={() => deleteHomeworkDefaulter(entry.id)}
                          style={{ background: 'none', border: 'none', padding: '0.3rem', borderRadius: '4px', cursor: 'pointer' }}
                          title="Delete record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '1rem 1.2rem' }}>
                      {entry.topic && (
                        <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                          <strong>Topic / Details:</strong> {entry.topic}
                        </p>
                      )}

                      {defaulterList.length === 0 ? (
                        <p style={{ color: '#065f46', fontSize: '0.88rem', margin: 0, fontStyle: 'italic' }}>
                          ✓ All students completed homework successfully for this session.
                        </p>
                      ) : (
                        <div className="data-table-container">
                          <table className="data-table" style={{ fontSize: '0.85rem' }}>
                            <thead>
                              <tr>
                                <th>Student Name</th>
                                <th>Status</th>
                                <th>Remarks / Reason</th>
                              </tr>
                            </thead>
                            <tbody>
                              {defaulterList.map(([studId, rec]) => {
                                const stud = students.find(s => s.id === studId);
                                return (
                                  <tr key={studId}>
                                    <td style={{ fontWeight: 600 }}>{stud ? stud.name : 'Unknown Student'}</td>
                                    <td>
                                      <span className="badge badge-danger">Defaulter</span>
                                    </td>
                                    <td style={{ color: 'var(--color-text-muted)' }}>{rec.remarks || 'No remarks provided'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDENT RISK ANALYTICS */}
      {activeTab === 'student-summary' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Student Homework Defaulter Frequency & Risk</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Aggregated non-submission incidents per student to identify academic intervention needs.
              </p>
            </div>
            <button className="btn btn-primary no-print" onClick={() => window.print()}>
              <Printer size={18} /> Print Analytics
            </button>
          </div>

          {students.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>No students available.</p>
          ) : (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Class Standard</th>
                    <th style={{ textAlign: 'center' }}>Total Defaulter Incidents</th>
                    <th>Risk Assessment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    const studentClass = classes.find(c => c.id === student.classId)?.name || 'Unassigned';
                    const defaultCount = analytics.studentDefaulterMap[student.id] || 0;

                    let riskBadge = <span className="badge badge-success">Clean Record (0 Defaults)</span>;
                    if (defaultCount >= 3) {
                      riskBadge = <span className="badge badge-danger">High Risk ({defaultCount} Defaults)</span>;
                    } else if (defaultCount > 0) {
                      riskBadge = <span className="badge badge-warning">Moderate Risk ({defaultCount} Defaults)</span>;
                    }

                    return (
                      <tr key={student.id}>
                        <td style={{ fontWeight: 600 }}>{student.name}</td>
                        <td>{studentClass}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: defaultCount > 0 ? '#ef4444' : '#10b981' }}>
                          {defaultCount}
                        </td>
                        <td>{riskBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeworkDefaulters;
