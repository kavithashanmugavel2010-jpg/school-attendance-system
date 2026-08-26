import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from './services/api';
import { rustArgon2Security } from './services/rustArgon2Security';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => rustArgon2Security.isSessionAuthenticated());
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [homeworkDefaulters, setHomeworkDefaulters] = useState(() => {
    try {
      const saved = localStorage.getItem('jvk_homework_defaulters');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('jvk_homework_defaulters', JSON.stringify(homeworkDefaulters));
    } catch (e) {
      console.warn("Failed to persist homework defaulters to localStorage", e);
    }
  }, [homeworkDefaulters]);

  // Sync state with backend
  const refreshData = async () => {
    setLoading(true);
    try {
      const [fetchedClasses, fetchedStudents, fetchedSubjects, fetchedAttendance, fetchedMarks, fetchedDefaulters] = await Promise.all([
        apiService.getClasses().catch(() => []),
        apiService.getStudents().catch(() => []),
        apiService.getSubjects().catch(() => []),
        apiService.getAttendance().catch(() => []),
        apiService.getMarks().catch(() => []),
        apiService.getHomeworkDefaulters().catch(() => [])
      ]);

      if (fetchedClasses.length > 0) setClasses(fetchedClasses);
      else loadDefaultClasses();

      setStudents(fetchedStudents);
      setSubjects(fetchedSubjects.length > 0 ? fetchedSubjects : generateDefaultSubjects(fetchedClasses));
      setAttendance(fetchedAttendance);
      setMarks(fetchedMarks);
      if (fetchedDefaulters && fetchedDefaulters.length > 0) {
        setHomeworkDefaulters(fetchedDefaulters);
      }
      setApiError(null);
    } catch (err) {
      console.warn("Backend API unavailable, utilizing cached state:", err);
      setApiError("Backend disconnected - using local state mode");
      loadDefaultClasses();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultClasses = () => {
    const defaultSubjectNames = ['L1', 'L2', 'L3', 'Science', 'Social', 'Maths', 'Computer'];
    
    const classSpecs = [
      { id: 'class_6_a', name: '6th A', section: 'Higher Secondary' },
      { id: 'class_6_b', name: '6th B', section: 'Higher Secondary' },
      { id: 'class_6_c', name: '6th C', section: 'Higher Secondary' },
      { id: 'class_6_d', name: '6th D', section: 'Higher Secondary' },
      { id: 'class_7_a', name: '7th A', section: 'Higher Secondary' },
      { id: 'class_7_b', name: '7th B', section: 'Higher Secondary' },
      { id: 'class_7_c', name: '7th C', section: 'Higher Secondary' },
      { id: 'class_7_d', name: '7th D', section: 'Higher Secondary' },
      { id: 'class_8_a', name: '8th A', section: 'Higher Secondary' },
      { id: 'class_8_b', name: '8th B', section: 'Higher Secondary' },
      { id: 'class_8_c', name: '8th C', section: 'Higher Secondary' }
    ];

    const initialClasses = [];
    const initialSubjects = [];

    classSpecs.forEach(cls => {
      initialClasses.push(cls);
      defaultSubjectNames.forEach((subjectName, index) => {
        initialSubjects.push({
          id: `${cls.id}_sub_${index}`,
          name: subjectName,
          classId: cls.id
        });
      });
    });

    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setStudents([
      { id: 'stud_6a_1', name: 'Sarvesh Kumar', classId: 'class_6_a' },
      { id: 'stud_6a_2', name: 'Aarav Sharma', classId: 'class_6_a' },
      { id: 'stud_6b_1', name: 'Karthik Raja', classId: 'class_6_b' },
      { id: 'stud_6c_1', name: 'Diya Patel', classId: 'class_6_c' },
      { id: 'stud_6d_1', name: 'Ananya Ramesh', classId: 'class_6_d' },
      { id: 'stud_7a_1', name: 'Joseph Antony', classId: 'class_7_a' },
      { id: 'stud_7b_1', name: 'Priya N', classId: 'class_7_b' },
      { id: 'stud_7c_1', name: 'Sanjay Prakash', classId: 'class_7_c' },
      { id: 'stud_7d_1', name: 'Vikram Sundar', classId: 'class_7_d' },
      { id: 'stud_8a_1', name: 'Vidya S', classId: 'class_8_a' },
      { id: 'stud_8b_1', name: 'Aditya Verma', classId: 'class_8_b' },
      { id: 'stud_8c_1', name: 'Nithin Kumar', classId: 'class_8_c' }
    ]);
  };

  const generateDefaultSubjects = (classList) => {
    const defaultSubjectNames = ['L1', 'L2', 'L3', 'Science', 'Social', 'Maths', 'Computer'];
    const subs = [];
    classList.forEach(cls => {
      defaultSubjectNames.forEach((name, idx) => {
        subs.push({ id: `${cls.id}_sub_${idx}`, name, classId: cls.id });
      });
    });
    return subs;
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const loginWithArgon2 = async (username, password) => {
    const res = await rustArgon2Security.verifyLoginCredentials(username, password);
    if (res.success) {
      setIsAuthenticated(true);
      refreshData();
    }
    return res;
  };

  const logout = () => {
    rustArgon2Security.logoutSession();
    setIsAuthenticated(false);
  };

  const addClass = async (className, section = 'Primary') => {
    try {
      const newClass = await apiService.addClass(className, section);
      setClasses(prev => [...prev, newClass]);
      refreshData();
    } catch (err) {
      const id = Date.now().toString();
      const newClass = { id, name: className, section };
      setClasses(prev => [...prev, newClass]);
    }
  };

  const deleteClass = async (id) => {
    try {
      await apiService.deleteClass(id);
      setClasses(prev => prev.filter(c => c.id !== id));
      setStudents(prev => prev.filter(s => s.classId !== id));
      setSubjects(prev => prev.filter(s => s.classId !== id));
    } catch (err) {
      setClasses(prev => prev.filter(c => c.id !== id));
      setStudents(prev => prev.filter(s => s.classId !== id));
    }
  };

  const addStudent = async (studentName, classId) => {
    try {
      const newStudent = await apiService.addStudent(studentName, classId);
      setStudents(prev => [...prev, newStudent]);
    } catch (err) {
      const id = Date.now().toString();
      setStudents(prev => [...prev, { id, name: studentName, classId }]);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await apiService.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const addSubject = async (subjectName, classId) => {
    try {
      const newSubject = await apiService.addSubject(subjectName, classId);
      setSubjects(prev => [...prev, newSubject]);
    } catch (err) {
      const id = Date.now().toString();
      setSubjects(prev => [...prev, { id, name: subjectName, classId }]);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await apiService.deleteSubject(id);
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const saveAttendance = async (classId, date, records) => {
    try {
      await apiService.saveAttendance(classId, date, records);
    } catch (err) {
      console.warn("Saving attendance locally:", err);
    }
    const updated = attendance.filter(a => !(a.classId === classId && a.date === date));
    updated.push({ classId, date, records });
    setAttendance(updated);
  };

  const saveMarks = async (classId, examType, subjectId, records) => {
    try {
      await apiService.saveMarks(classId, examType, subjectId, records);
    } catch (err) {
      console.warn("Saving marks locally:", err);
    }
    const updated = marks.filter(m => !(m.classId === classId && m.examType === examType && m.subjectId === subjectId));
    updated.push({ classId, examType, subjectId, records });
    setMarks(updated);
  };

  const saveHomeworkDefaulters = async (classId, date, subjectName, topic, records) => {
    try {
      await apiService.saveHomeworkDefaulters(classId, date, subjectName, topic, records);
    } catch (err) {
      console.warn("Saving homework defaulters locally:", err);
    }
    const entryId = `hd_${classId}_${date}_${subjectName.replace(/\s+/g, '_')}`;
    const newRecord = {
      id: entryId,
      classId,
      date,
      subjectName,
      topic: topic || 'Regular Homework',
      records,
      updatedAt: new Date().toISOString()
    };
    setHomeworkDefaulters(prev => {
      const filtered = prev.filter(item => !(item.classId === classId && item.date === date && item.subjectName.toLowerCase() === subjectName.toLowerCase()));
      return [newRecord, ...filtered];
    });
  };

  const deleteHomeworkDefaulter = (id) => {
    setHomeworkDefaulters(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated, loginWithArgon2, logout, loading, apiError, refreshData,
      classes, setClasses, addClass, deleteClass,
      students, setStudents, addStudent, deleteStudent,
      subjects, setSubjects, addSubject, deleteSubject,
      attendance, setAttendance, saveAttendance,
      marks, setMarks, saveMarks,
      homeworkDefaulters, setHomeworkDefaulters, saveHomeworkDefaulters, deleteHomeworkDefaulter
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
