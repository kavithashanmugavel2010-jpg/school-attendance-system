import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store';
import { Save } from 'lucide-react';

const EXAM_TYPES = ['PA1', 'PA2', 'PA3', 'PA4', 'Term 1', 'Term 2'];

const Marks = () => {
  const { classes, students, subjects, marks, setMarks } = useAppContext();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedExam, setSelectedExam] = useState('PA1');

  const classStudents = students.filter(s => s.classId === selectedClassId);
  const classSubjects = subjects.filter(s => s.classId === selectedClassId);

  // Find existing marks record for this class and exam
  const existingRecordIndex = marks.findIndex(m => m.classId === selectedClassId && m.examType === selectedExam);
  const existingRecord = existingRecordIndex >= 0 ? marks[existingRecordIndex] : null;

  // Local state for the form: { studentId: { subjectId: "95" } }
  const [currentMarks, setCurrentMarks] = useState({});

  useEffect(() => {
    if (existingRecord) {
      setCurrentMarks(existingRecord.records);
    } else {
      setCurrentMarks({});
    }
  }, [selectedClassId, selectedExam, marks]);

  const handleMarkChange = (studentId, subjectId, value) => {
    setCurrentMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subjectId]: value
      }
    }));
  };

  const handleSave = () => {
    if (!selectedClassId) return;

    const newRecord = {
      id: existingRecord ? existingRecord.id : Date.now().toString(),
      classId: selectedClassId,
      examType: selectedExam,
      records: currentMarks
    };

    if (existingRecordIndex >= 0) {
      const newMarks = [...marks];
      newMarks[existingRecordIndex] = newRecord;
      setMarks(newMarks);
    } else {
      setMarks([...marks, newRecord]);
    }
    alert('Marks saved successfully!');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Mark Register</h1>
          <p>Enter exam scores for students.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ minWidth: '200px' }}>
            <label>Select Class</label>
            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
              <option value="">-- Choose a class --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ minWidth: '200px' }}>
            <label>Exam Type</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}>
              {EXAM_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {selectedClassId && classStudents.length > 0 && classSubjects.length > 0 && (
          <div>
            <div className="data-table-container" style={{ marginBottom: '1.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    {classSubjects.map(sub => (
                      <th key={sub.id}>{sub.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map(student => (
                    <tr key={student.id}>
                      <td style={{ fontWeight: 500 }}>{student.name}</td>
                      {classSubjects.map(sub => (
                        <td key={sub.id}>
                          <input 
                            type="number" 
                            min="0"
                            max="100"
                            placeholder="-"
                            value={(currentMarks[student.id] && currentMarks[student.id][sub.id]) || ''}
                            onChange={(e) => handleMarkChange(student.id, sub.id, e.target.value)}
                            style={{ 
                              width: '60px', 
                              padding: '0.4rem', 
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              textAlign: 'center'
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Marks
            </button>
          </div>
        )}

        {selectedClassId && (classStudents.length === 0 || classSubjects.length === 0) && (
          <p className="text-muted">Ensure you have added both students and subjects to this class before entering marks.</p>
        )}
      </div>
    </div>
  );
};

export default Marks;
