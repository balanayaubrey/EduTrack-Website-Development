import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { InvitationAcceptPage } from './components/InvitationAcceptPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import bg3 from 'figma:asset/090fb96927b99d476237fb3d190eb39f036500e1.png';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invitationToken, setInvitationToken] = useState(null);

  // -----------------------------
  // LOAD SESSION OR INVITATION
  // -----------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('invitation');

    if (token) {
      setInvitationToken(token);
      setIsLoading(false);
      return;
    }

    const savedUser = localStorage.getItem('edutrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // -----------------------------
  // LOGIN HANDLER
  // -----------------------------
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("edutrack_user", JSON.stringify(userData));
    localStorage.setItem("edutrack_token", userData.token ?? "");
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("edutrack_user");
    localStorage.removeItem("edutrack_token");
  };

  const handleInvitationComplete = () => {
    setInvitationToken(null);
    window.history.pushState({}, "", window.location.pathname);
  };

  // -----------------------------
  // LOADING SCREEN
  // -----------------------------
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-center">Loading EduTrack...</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // INVITATION ACCEPT PAGE
  // -----------------------------
  if (invitationToken && !user) {
    return (
      <InvitationAcceptPage
        invitationToken={invitationToken}
        onComplete={handleInvitationComplete}
      />
    );
  }

  // -----------------------------
  // LOGIN PAGE
  // -----------------------------
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // -----------------------------
  // ROLE-BASED DASHBOARD
  // -----------------------------
  switch (user.role) {
    case "admin":
      return <AdminDashboard user={user} onLogout={handleLogout} />;

    case "faculty":
      return <FacultyDashboard user={user} onLogout={handleLogout} />;

    case "student":
      return <StudentDashboard user={user} onLogout={handleLogout} />;

    default:
      return <AuthPage onLogin={handleLogin} />;
  }
}
