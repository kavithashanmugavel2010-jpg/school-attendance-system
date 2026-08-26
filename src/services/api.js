const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jvk_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const apiService = {
  // Authentication
  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      throw new Error('Invalid credentials');
    }
    const data = await res.json();
    sessionStorage.setItem('jvk_jwt_token', data.token);
    sessionStorage.setItem('jvk_auth', 'true');
    return data;
  },

  logout() {
    sessionStorage.removeItem('jvk_jwt_token');
    sessionStorage.removeItem('jvk_auth');
  },

  // Classes
  async getClasses() {
    const res = await fetch(`${API_BASE_URL}/classes`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  },

  async addClass(name, section) {
    const res = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, section })
    });
    if (!res.ok) throw new Error('Failed to add class');
    return res.json();
  },

  async deleteClass(id) {
    const res = await fetch(`${API_BASE_URL}/classes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete class');
  },

  // Students
  async getStudents(classId = '') {
    const url = classId ? `${API_BASE_URL}/students?classId=${classId}` : `${API_BASE_URL}/students`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async addStudent(name, classId) {
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, classId })
    });
    if (!res.ok) throw new Error('Failed to add student');
    return res.json();
  },

  async deleteStudent(id) {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete student');
  },

  // Subjects
  async getSubjects(classId = '') {
    const url = classId ? `${API_BASE_URL}/subjects?classId=${classId}` : `${API_BASE_URL}/subjects`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },

  async addSubject(name, classId) {
    const res = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, classId })
    });
    if (!res.ok) throw new Error('Failed to add subject');
    return res.json();
  },

  async deleteSubject(id) {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete subject');
  },

  // Attendance
  async getAttendance(classId = '', date = '') {
    const url = (classId && date) 
      ? `${API_BASE_URL}/attendance?classId=${classId}&date=${date}` 
      : `${API_BASE_URL}/attendance`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch attendance');
    return res.json();
  },

  async saveAttendance(classId, date, records) {
    const res = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ classId, date, records })
    });
    if (!res.ok) throw new Error('Failed to save attendance');
  },

  // Marks
  async getMarks(classId = '', examType = '', subjectId = '') {
    const url = (classId && examType && subjectId)
      ? `${API_BASE_URL}/marks?classId=${classId}&examType=${examType}&subjectId=${subjectId}`
      : `${API_BASE_URL}/marks`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch marks');
    return res.json();
  },

  async saveMarks(classId, examType, subjectId, records) {
    const res = await fetch(`${API_BASE_URL}/marks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ classId, examType, subjectId, records })
    });
    if (!res.ok) throw new Error('Failed to save marks');
  },

  // Homework Defaulters
  async getHomeworkDefaulters(classId = '', date = '') {
    const url = (classId && date)
      ? `${API_BASE_URL}/defaulters?classId=${classId}&date=${date}`
      : `${API_BASE_URL}/defaulters`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch homework defaulters');
    return res.json();
  },

  async saveHomeworkDefaulters(classId, date, subjectName, topic, records) {
    const res = await fetch(`${API_BASE_URL}/defaulters`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ classId, date, subjectName, topic, records })
    });
    if (!res.ok) throw new Error('Failed to save homework defaulters');
  }
};
