
import React, { useState, useRef, useEffect } from 'react';
import { X, Save, User, Camera, Upload, RefreshCw, Trash2 } from 'lucide-react';
import { Student, SchoolLevel } from '../types';
import { GRADE_LEVELS } from '../constants';

interface StudentFormProps {
  student?: Student;
  onSave: (student: Student) => void;
  onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Student>>(student || {
    firstName: '',
    lastName: '',
    gender: 'M',
    dob: '',
    level: SchoolLevel.PRIMARY,
    gradeLevel: 'Class 1',
    parentName: '',
    parentPhone: '',
    status: 'active',
    photo: undefined
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Camera access error:", err);
          setIsCameraActive(false);
          alert("Could not access camera. Please check permissions.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photo = canvas.toDataURL('image/jpeg');
        setFormData({ ...formData, photo });
        setIsCameraActive(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = {
      ...formData,
      id: student?.id || Math.random().toString(36).substr(2, 9),
      regNumber: student?.regNumber || `HCS-${Math.floor(Math.random() * 9000) + 1000}`,
    } as Student;
    onSave(newStudent);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
        <div className="p-6 bg-blue-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <User className="text-amber-500" />
            <h3 className="text-xl font-bold">{student ? 'Edit Student Profile' : 'Register New Student'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          {/* Photo Section */}
          <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {isCameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover mirror"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                ) : formData.photo ? (
                  <img src={formData.photo} alt="Student Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-slate-200" />
                )}
              </div>
              
              {!isCameraActive && (
                <div className="absolute -bottom-2 right-0 flex gap-1">
                  <button 
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
                    title="Take Photo"
                  >
                    <Camera size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-all"
                    title="Upload Photo"
                  >
                    <Upload size={16} />
                  </button>
                </div>
              )}
            </div>

            {isCameraActive ? (
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={handleCapture}
                  className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-2"
                >
                  <Camera size={14} /> Capture
                </button>
                <button 
                  type="button"
                  onClick={() => setIsCameraActive(false)}
                  className="px-4 py-2 bg-rose-500 text-white text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : formData.photo && (
              <button 
                type="button"
                onClick={() => setFormData({...formData, photo: undefined})}
                className="flex items-center gap-2 text-xs text-rose-500 font-semibold hover:underline"
              >
                <Trash2 size={12} /> Remove Photo
              </button>
            )}

            {!isCameraActive && !formData.photo && (
              <p className="text-xs text-slate-400 font-medium">Add a profile photo for the student</p>
            )}
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">First Name</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Last Name</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Grade Level</label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.gradeLevel}
                onChange={(e) => {
                  const level = e.target.value.includes('JHS') || e.target.value.includes('Basic') ? SchoolLevel.JHS : SchoolLevel.PRIMARY;
                  setFormData({...formData, gradeLevel: e.target.value, level});
                }}
              >
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Parent/Guardian Name</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.parentName}
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Parent Contact Phone</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={formData.parentPhone}
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t shrink-0">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all"
            >
              <Save size={18} />
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
