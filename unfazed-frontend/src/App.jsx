import React, { useState, useEffect } from 'react';
import axiosInstance from './api/axiosInstance';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientPortal from './pages/PatientPortal';

export default function App() {
  const [role, setRole] = useState(null); // 'doctor' | 'patient'
  const [therapist, setTherapist] = useState(null);

  useEffect(() => {
    axiosInstance.get('/public/therapist/dr-sharma')
      .then(res => setTherapist(res.data))
      .catch(err => console.error(err));
  }, []);

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome to HomeCare</h1>
          <p className="text-sm text-slate-500">Select how you want to use the platform</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setRole('doctor')}
              className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="text-4xl mb-3">🩺</div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Doctor / Therapist</h3>
              <p className="text-xs text-slate-400 mt-1">Manage practice, patients & schedule</p>
            </button>
            <button
              onClick={() => setRole('patient')}
              className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-600">Patient / Client</h3>
              <p className="text-xs text-slate-400 mt-1">Book sessions, view notes & chat</p>
            </button>
          </div>
          <button
            onClick={() => setRole('doctor')}
            className="text-xs text-slate-400 hover:text-blue-500 underline"
          >
            Skip to doctor dashboard →
          </button>
        </div>
      </div>
    );
  }

  return role === 'doctor'
    ? <DoctorDashboard therapist={therapist} onSwitchRole={() => setRole(null)} />
    : <PatientPortal therapist={therapist} onSwitchRole={() => setRole(null)} />;
}
