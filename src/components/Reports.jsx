import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store';
import { Printer, Award, GraduationCap, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

const exams = ['PA1', 'PA2', 'PA3', 'PA4', 'Term 1', 'Term 2'];

const Reports = () => {
  const { classes, students, subjects, marks, attendance, homeworkDefaulters = [] } = useAppContext();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const classStudents = useMemo(() => students.filter(s => s.classId === selectedClass), [students, selectedClass]);
  const classSubjects = useMemo(() => subjects.filter(s => s.classId === selectedClass), [subjects, selectedClass]);

  const studentMarks = useMemo(() => {
    if (!selectedStudent) return {};
    const report = {};
    classSubjects.forEach(subject => {
      report[subject.id] = {};
      exams.forEach(exam => {
        const examRecord = marks.find(m => m.classId === selectedClass && m.subjectId === subject.id && m.examType === exam);
        report[subject.id][exam] = examRecord?.records?.[selectedStudent] || '-';
      });
    });
    return report;
  }, [selectedClass, selectedStudent, classSubjects, marks]);

  const studentAttendance = useMemo(() => {
    if (!selectedStudent) return { totalDays: 0, presentDays: 0 };
    const classAttendance = attendance.filter(a => a.classId === selectedClass);
    let totalDays = classAttendance.length;
    let presentDays = 0;
    classAttendance.forEach(a => {
      if (a.records && a.records[selectedStudent] === 'Present') {
        presentDays++;
      }
    });
    return { totalDays, presentDays };
  }, [selectedClass, selectedStudent, attendance]);

  const studentHomeworkDefaulterCount = useMemo(() => {
    if (!selectedStudent) return 0;
    let count = 0;
    homeworkDefaulters.forEach(entry => {
      if (entry.classId === selectedClass && entry.records && entry.records[selectedStudent]) {
        const rec = entry.records[selectedStudent];
        if (rec.isDefaulter || rec.status === 'Defaulter') {
          count++;
        }
      }
    });
    return count;
  }, [selectedClass, selectedStudent, homeworkDefaulters]);

  const currentStudentObj = students.find(s => s.id === selectedStudent);
  const currentClassObj = classes.find(c => c.id === selectedClass);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header no-print">
        <div>
          <h1>Student Academic Report Cards</h1>
          <p>Generate, review, and print official student performance records.</p>
        </div>
      </div>

      {/* Selectors Card */}
      <div className="card no-print" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Class Standard *</label>
            <select 
              value={selectedClass} 
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedStudent('');
              }}
            >
              <option value="">-- Choose Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label style={{ fontWeight: 600 }}>Select Student *</label>
            <select 
              value={selectedStudent} 
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!selectedClass}
            >
              <option value="">-- Choose Student --</option>
              {classStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Printable Student Report Card */}
      {selectedStudent ? (
        <div className="card" style={{ position: 'relative', padding: '2.5rem 2rem', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
          <button 
            className="btn btn-primary no-print"
            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
            onClick={() => window.print()}
          >
            <Printer size={18} /> Print Official Report
          </button>
          
          {/* Report School Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <img 
                src="/logo.png" 
                alt="DMI Crest" 
                style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', padding: '2px', backgroundColor: '#fff' }} 
              />
            </div>
            <h1 style={{ fontSize: '2.1rem', margin: '0 0 0.2rem 0', color: 'var(--color-primary)' }}>
              St. Joseph Vidya Kshetra
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
              DMI Foundations — Official Academic Report Card
            </p>
          </div>

          {/* Student Profile Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>STUDENT NAME</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
                {currentStudentObj?.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CLASS STANDARD</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
                {currentClassObj?.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>ATTENDANCE RATE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
                {studentAttendance.presentDays} / {studentAttendance.totalDays} Days ({studentAttendance.totalDays > 0 ? Math.round((studentAttendance.presentDays / studentAttendance.totalDays) * 100) : 0}%)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>HOMEWORK DISCIPLINE</div>
              <div style={{ marginTop: '0.25rem' }}>
                {studentHomeworkDefaulterCount > 0 ? (
                  <span className="badge badge-danger" style={{ fontSize: '0.85rem' }}>
                    <AlertTriangle size={14} /> {studentHomeworkDefaulterCount} Default(s)
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                    <CheckCircle2 size={14} /> Clean Record (0 Defaults)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Academic Mark Matrix Table */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
              Subject Mark Register & Exam Evaluations
            </h3>

            {classSubjects.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem' }}>No subjects defined for this class.</p>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Subject</th>
                      {exams.map(exam => (
                        <th key={exam} style={{ textAlign: 'center' }}>{exam}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classSubjects.map(subject => (
                      <tr key={subject.id}>
                        <td style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{subject.name}</td>
                        {exams.map(exam => (
                          <td key={exam} style={{ textAlign: 'center', fontWeight: 500 }}>
                            {studentMarks[subject.id][exam]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Signature Blocks */}
          <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '160px', borderBottom: '1.5px solid var(--color-text-main)', marginBottom: '0.5rem' }}></div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)', margin: 0 }}>Class Teacher</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '160px', borderBottom: '1.5px solid var(--color-text-main)', marginBottom: '0.5rem' }}></div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)', margin: 0 }}>School Principal</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
          <FileText size={48} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
          <p>Please select a class and student to preview their academic report card.</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
