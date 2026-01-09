
import { Student, AttendanceRecord, GradeRecord, FeeRecord, SchoolLevel, FeeTransaction, FeeStructure, Subject, Exam, TimetableEntry } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STORAGE_KEYS = {
  STUDENTS: 'hcs_students',
  ATTENDANCE: 'hcs_attendance',
  GRADES: 'hcs_grades',
  FEES: 'hcs_fees',
  TRANSACTIONS: 'hcs_transactions',
  STRUCTURE: 'hcs_fee_structure',
  SUBJECTS: 'hcs_subjects',
  EXAMS: 'hcs_exams',
  TIMETABLE: 'hcs_timetable'
};

const defaultStudents: Student[] = [];

const defaultFeeStructure: FeeStructure[] = [
  { id: 's1', gradeLevel: 'Class 1', tuition: 800, canteen: 400, others: 300, total: 1500 },
  { id: 's2', gradeLevel: 'Class 2', tuition: 800, canteen: 400, others: 300, total: 1500 },
  { id: 's3', gradeLevel: 'Class 3', tuition: 800, canteen: 400, others: 300, total: 1500 },
  { id: 's4', gradeLevel: 'Class 4', tuition: 800, canteen: 400, others: 300, total: 1500 },
  { id: 's5', gradeLevel: 'Basic 7 (JHS 1)', tuition: 1200, canteen: 500, others: 300, total: 2000 },
  { id: 's6', gradeLevel: 'Basic 8 (JHS 2)', tuition: 1200, canteen: 500, others: 300, total: 2000 },
];

const defaultSubjects: Subject[] = [
  { id: 'sub1', name: 'English Language', levels: ['Primary', 'JHS'] },
  { id: 'sub2', name: 'Mathematics', levels: ['Primary', 'JHS'] },
  { id: 'sub3', name: 'Science', levels: ['Primary', 'JHS'] },
  { id: 'sub4', name: 'Social Studies', levels: ['Primary', 'JHS'] },
  { id: 'sub5', name: 'RME', levels: ['Primary', 'JHS'] },
  { id: 'sub6', name: 'OWOP', levels: ['Primary', 'JHS'] },
  { id: 'sub7', name: 'Creative Arts', levels: ['Primary', 'JHS'] },
  { id: 'sub8', name: 'ICT', levels: ['Primary', 'JHS'] },
  { id: 'sub9', name: 'French', levels: ['Primary', 'JHS'] },
  { id: 'sub10', name: 'Twi', levels: ['Primary', 'JHS'] },
];

const defaultExams: Exam[] = [];

const defaultTimetable: TimetableEntry[] = [];

export const dataService = {
  getStudents: async (): Promise<Student[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      // Fallback to localStorage
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    }
  },

  saveStudent: async (student: Student) => {
    try {
      const method = 'POST'; // Since id is always provided, but to create or update
      const url = `${API_BASE_URL}/api/students`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (!response.ok) throw new Error('Failed to save student');
      // Immediately sync fees after saving a student
      dataService.syncFeeRecords();
    } catch (error) {
      console.error('Error saving student:', error);
      // Fallback to localStorage
      const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
      const index = students.findIndex((s: Student) => s.id === student.id);
      if (index >= 0) students[index] = student;
      else students.push(student);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      dataService.syncFeeRecords();
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete student');
    } catch (error) {
      console.error('Error deleting student:', error);
      // Fallback to localStorage
      const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]').filter((s: Student) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  },

  getFees: async (): Promise<FeeRecord[]> => {
    await dataService.syncFeeRecords();
    const data = localStorage.getItem(STORAGE_KEYS.FEES);
    return data ? JSON.parse(data) : [];
  },

  saveFee: async (fee: FeeRecord) => {
    const fees = await dataService.getFees();
    const index = fees.findIndex(f => f.studentId === fee.studentId);
    if (index >= 0) fees[index] = fee;
    else fees.push(fee);
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
  },

  syncFeeRecords: async () => {
    const students = await dataService.getStudents();
    const currentFees = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEES) || '[]');
    const structures = dataService.getFeeStructures();

    let updated = false;
    students.forEach(student => {
      if (!currentFees.find((f: any) => f.studentId === student.id)) {
        const structure = structures.find(s => s.gradeLevel === student.gradeLevel);
        currentFees.push({
          id: 'f-' + student.id,
          studentId: student.id,
          amountDue: structure ? structure.total : (student.level === SchoolLevel.PRIMARY ? 1500 : 2000),
          amountPaid: 0,
          lastPaymentDate: '',
          status: 'unpaid'
        });
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(currentFees));
    }
  },

  getTransactions: (): FeeTransaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  addTransaction: async (transaction: FeeTransaction) => {
    const txs = dataService.getTransactions();
    txs.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

    const fees = await dataService.getFees();
    const feeIndex = fees.findIndex(f => f.studentId === transaction.studentId);
    if (feeIndex >= 0) {
      fees[feeIndex].amountPaid += transaction.amount;
      fees[feeIndex].lastPaymentDate = transaction.date;
      const balance = fees[feeIndex].amountDue - fees[feeIndex].amountPaid;
      fees[feeIndex].status = balance <= 0 ? 'paid' : (fees[feeIndex].amountPaid > 0 ? 'partial' : 'unpaid');
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
    }
  },

  getFeeStructures: (): FeeStructure[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STRUCTURE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STRUCTURE, JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  },

  saveFeeStructure: (structure: FeeStructure) => {
    const structures = dataService.getFeeStructures();
    const index = structures.findIndex(s => s.id === structure.id);
    if (index >= 0) structures[index] = structure;
    else structures.push(structure);
    localStorage.setItem(STORAGE_KEYS.STRUCTURE, JSON.stringify(structures));
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance: (newRecords: AttendanceRecord[]) => {
    const existing = dataService.getAttendance();
    const recordMap = new Map<string, AttendanceRecord>();
    existing.forEach(r => recordMap.set(`${r.studentId}_${r.date}`, r));
    newRecords.forEach(r => recordMap.set(`${r.studentId}_${r.date}`, r));
    const updated = Array.from(recordMap.values());
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
  },

  getGrades: (): GradeRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GRADES);
    return data ? JSON.parse(data) : [];
  },

  saveGrade: (grade: GradeRecord) => {
    const grades = dataService.getGrades();
    grades.push(grade);
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  },

  getSubjects: (): Subject[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(defaultSubjects));
      return defaultSubjects;
    }
    return JSON.parse(data);
  },

  saveSubject: (subject: Subject) => {
    const subjects = dataService.getSubjects();
    const index = subjects.findIndex(s => s.id === subject.id);
    if (index >= 0) subjects[index] = subject;
    else subjects.push(subject);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  deleteSubject: (id: string) => {
    const subjects = dataService.getSubjects().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  getExams: (): Exam[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(defaultExams));
      return defaultExams;
    }
    return JSON.parse(data);
  },

  saveExam: (exam: Exam) => {
    const exams = dataService.getExams();
    const index = exams.findIndex(e => e.id === exam.id);
    if (index >= 0) exams[index] = exam;
    else exams.push(exam);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  deleteExam: (id: string) => {
    const exams = dataService.getExams().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  getTimetable: (): TimetableEntry[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(defaultTimetable));
      return defaultTimetable;
    }
    return JSON.parse(data);
  },

  saveTimetableEntry: (entry: TimetableEntry) => {
    const timetable = dataService.getTimetable();
    const index = timetable.findIndex(t => t.id === entry.id);
    if (index >= 0) timetable[index] = entry;
    else timetable.push(entry);
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  },

  deleteTimetableEntry: (id: string) => {
    const timetable = dataService.getTimetable().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }
};
