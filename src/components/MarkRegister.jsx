import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../store';
import { Save, GraduationCap, CheckCircle2, Award, TrendingUp, Sparkles } from 'lucide-react';

const exams = ['PA1', 'PA2', 'PA3', 'PA4', 'Term 1', 'Term 2'];

const MarkRegister = () => {
  const { classes, subjects, students, marks, saveMarks } = useAppContext();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [records, setRecords] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const classStudents = useMemo(() => students.filter(s => s.classId === selectedClass), [students, selectedClass]);
  const classSubjects = useMemo(() => subjects.filter(s => s.classId === selectedClass), [subjects, selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedExam) {
      const existingRecord = marks.find(
        m => m.classId === selectedClass && m.subjectId === selectedSubject && m.examType === selectedExam
      );
      if (existingRecord && existingRecord.records) {
        setRecords(existingRecord.records);
      } else {
        const initialRecords = {};
        classStudents.forEach(s => {
          initialRecords[s.id] = '';
        });
        setRecords(initialRecords);
      }
    } else {
      setRecords({});
    }
  }, [selectedClass, selectedSubject, selectedExam, marks, classStudents]);

  const handleChange = (studentId, value) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSave = () => {
    if (selectedClass && selectedSubject && selectedExam) {
      saveMarks(selectedClass, selectedExam, selectedSubject, records);
      const subjName = classSubjects.find(s => s.id === selectedSubject)?.name || 'Subject';
      setSaveSuccessMsg(`Marks saved for ${subjName} (${selectedExam})!`);
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    }
  };

  // Filter for 6th to 8th standard classes or available classes
  const targetClasses = useMemo(() => {
    const matched = classes.filter(c => {
      const name = c.name.toLowerCase();
      return name.includes('6th') || name.includes('7th') || name.includes('8th') || name.includes('grade 6') || name.includes('grade 7') || name.includes('grade 8');
    });
    return matched.length > 0 ? matched : classes;
  }, [classes]);

  useEffect(() => {
    if (targetClasses.length > 0 && !selectedClass) {
      setSelectedClass(targetClasses[0].id);
    }
  }, [targetClasses, selectedClass]);

  // Compute live score analytics
  const scoreStats = useMemo(() => {
    const validScores = Object.values(records)
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (validScores.length === 0) return { avg: 0, max: 0, count: 0 };

    const sum = validScores.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / validScores.length) * 10) / 10;
    const max = Math.max(...validScores);
    return { avg, max, count: validScores.length };
  }, [records]);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Academic Mark Register</h1>
          <p>Record exam marks, PA tests, and term evaluations for 6th to 8th Standard classes.</p>
        </div>

        {saveSuccessMsg ? (
          <div className="animate-scale-up" style={{
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '0.5rem 1.2rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} /> {saveSuccessMsg}
          </div>
        ) : (
          <span className="badge badge-primary" style={{ padding: '0.4rem 0.8rem' }}>
            Configured for 6th – 8th Standard
          </span>
        )}
      </div>

      {/* Control Filters Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {/* Class Select */}
          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Class (6th to 8th) *</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="">-- Choose Class --</option>
              {targetClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Subject *</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} disabled={!selectedClass}>
              <option value="">-- Choose Subject --</option>
              {classSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {['L1', 'L2', 'L3', 'Maths', 'Science', 'Social', 'Computer Science'].map(subjName => {
                const matchedSub = classSubjects.find(s => s.name.toLowerCase() === subjName.toLowerCase());
                const isSelected = selectedSubject && matchedSub && selectedSubject === matchedSub.id;
                return (
                  <button
                    key={subjName}
                    type="button"
                    style={{
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.72rem',
                      backgroundColor: isSelected ? '#4338ca' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : 'var(--color-text-main)',
                      border: '1px solid ' + (isSelected ? '#4338ca' : 'var(--border-color)'),
                      borderRadius: 'var(--radius-pill)',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 600 : 400
                    }}
                    onClick={() => {
                      if (matchedSub) {
                        setSelectedSubject(matchedSub.id);
                      }
                    }}
                  >
                    {subjName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam Select */}
          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Exam Type *</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
              <option value="">-- Choose Exam --</option>
              {exams.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Mark Entry Content */}
      {selectedClass && selectedSubject && selectedExam && (
        <div>
          {/* Score Analytics Stats Bar */}
          <div className="grid-cards" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <div className="card" style={{ borderLeft: '4px solid #4f46e5', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>STUDENTS GRADED</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#1e1b4b' }}>{scoreStats.count} / {classStudents.length}</h3>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #3b82f6', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>CLASS AVERAGE</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#1e40af' }}>{scoreStats.avg}</h3>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #10b981', padding: '1.1rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>HIGHEST SCORE</span>
              <h3 style={{ fontSize: '1.6rem', margin: '0.2rem 0 0 0', color: '#065f46' }}>{scoreStats.max}</h3>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ margin: 0 }}>
                  Enter Scores — {classSubjects.find(s => s.id === selectedSubject)?.name}
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem' }}>
                  Exam: <strong>{selectedExam}</strong> | Class: <strong>{classes.find(c => c.id === selectedClass)?.name}</strong>
                </p>
              </div>

              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={18} /> Save Marks
              </button>
            </div>

            {classStudents.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>No students found in this class.</p>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Student Name</th>
                      <th style={{ width: '220px' }}>Score Entry</th>
                      <th style={{ width: '150px' }}>Performance Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student, idx) => {
                      const val = records[student.id] || '';
                      const numVal = parseFloat(val);

                      let perfBadge = <span className="badge badge-info">Pending</span>;
                      if (!isNaN(numVal)) {
                        if (numVal >= 80) perfBadge = <span className="badge badge-success">Excellent ({numVal})</span>;
                        else if (numVal >= 50) perfBadge = <span className="badge badge-primary">Pass ({numVal})</span>;
                        else perfBadge = <span className="badge badge-danger">Needs Help ({numVal})</span>;
                      }

                      return (
                        <tr key={student.id}>
                          <td style={{ fontWeight: 500, color: 'var(--color-text-subtle)' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600 }}>{student.name}</td>
                          <td>
                            <input
                              type="number"
                              style={{
                                padding: '0.5rem 0.75rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                width: '120px',
                                fontSize: '0.9rem'
                              }}
                              value={val}
                              onChange={(e) => handleChange(student.id, e.target.value)}
                              placeholder="Score (0-100)"
                            />
                          </td>
                          <td>{perfBadge}</td>
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

export default MarkRegister;
