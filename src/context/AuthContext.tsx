import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, GradeLevel } from '../types/index.ts';
import { auth, db, signInWithGoogle as fbSignInWithGoogle, logOutFirebase } from '../firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isTeacherPinVerified: boolean;
  advaitCoins: number;
  login: (userData: UserProfile, token?: string) => void;
  loginWithGoogle: () => Promise<UserProfile>;
  logout: () => void;
  updateGrade: (grade: GradeLevel) => void;
  addAdvaitCoins: (amount: number, reason?: string) => void;
  verifyTeacherPin: (pin: string) => Promise<{ success: boolean; error?: string; remainingSecs?: number }>;
  unlockTeacherConsole: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'advait_insights_user_session';
const AUTH_TOKEN_KEY = 'advait_insights_auth_token';
const TEACHER_VERIFIED_KEY = 'advait_teacher_pin_verified_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [isTeacherPinVerified, setIsTeacherPinVerified] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(TEACHER_VERIFIED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);

      // Anti-Tamper Security Guard:
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (parsed.role === 'teacher' && (!savedToken || !savedToken.includes('teacher'))) {
        console.warn('Security Alert: Unauthorized role detected. Downgrading to student session.');
        parsed.role = 'student';
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);

          let userProfile: UserProfile;
          const isFaculty =
            fbUser.email?.toLowerCase() === 'advaitinsights1927@gmail.com' ||
            fbUser.email?.toLowerCase() === 'rishikasinghrajput2006@gmail.com';

          if (docSnap.exists()) {
            const data = docSnap.data();
            userProfile = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Advaitian Student',
              emailOrPhone: fbUser.email || '',
              role: isFaculty ? 'teacher' : (data.role || 'student'),
              grade: data.grade || 'class10',
              rollNumberOrSection: data.rollNumberOrSection || 'CBSE 2026',
              advaitCoins: data.advaitCoins ?? 25,
            };
          } else {
            userProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Advaitian Student',
              emailOrPhone: fbUser.email || '',
              role: isFaculty ? 'teacher' : 'student',
              grade: 'class10',
              rollNumberOrSection: 'CBSE 2026',
              advaitCoins: 25, // 25 Coins welcome bonus for Google Firebase login
            };
            await setDoc(userDocRef, {
              id: fbUser.uid,
              name: userProfile.name,
              email: userProfile.emailOrPhone,
              role: userProfile.role,
              grade: userProfile.grade,
              rollNumberOrSection: userProfile.rollNumberOrSection,
              advaitCoins: userProfile.advaitCoins,
              createdAt: new Date().toISOString(),
            });
          }

          const token = isFaculty
            ? 'advait_teacher_master_session_2026'
            : `advait_firebase_${fbUser.uid}`;

          setUser(userProfile);
          setAuthToken(token);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userProfile));
          localStorage.setItem(AUTH_TOKEN_KEY, token);

          if (isFaculty) {
            setIsTeacherPinVerified(true);
            sessionStorage.setItem(TEACHER_VERIFIED_KEY, 'true');
          }
        } catch (err) {
          console.error('Error syncing Firebase user profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher' && (!authToken || !authToken.includes('teacher'))) {
        const sanitized = { ...user, role: 'student' as const };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sanitized));
      } else {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(TEACHER_VERIFIED_KEY);
      setIsTeacherPinVerified(false);
    }
  }, [user, authToken]);

  const login = (userData: UserProfile, token?: string) => {
    const assignedToken = token || (userData.role === 'teacher'
      ? `advait_teacher_master_session_2026`
      : `advait_student_${Date.now()}`);

    setUser(userData);
    setAuthToken(assignedToken);
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, assignedToken);
    } catch {
      // ignore
    }

    if (userData.role === 'teacher') {
      setIsTeacherPinVerified(true);
      try {
        sessionStorage.setItem(TEACHER_VERIFIED_KEY, 'true');
      } catch {
        // ignore
      }
    }
  };

  // 1-Click Firebase Google Sign-In
  const loginWithGoogle = async (): Promise<UserProfile> => {
    const cred = await fbSignInWithGoogle();
    const fbUser = cred.user;
    const isFaculty =
      fbUser.email?.toLowerCase() === 'advaitinsights1927@gmail.com' ||
      fbUser.email?.toLowerCase() === 'rishikasinghrajput2006@gmail.com';

    const userProfile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Advaitian Student',
      emailOrPhone: fbUser.email || '',
      role: isFaculty ? 'teacher' : 'student',
      grade: 'class10',
      rollNumberOrSection: 'CBSE 2026',
      advaitCoins: 25,
    };

    const assignedToken = isFaculty
      ? 'advait_teacher_master_session_2026'
      : `advait_firebase_${fbUser.uid}`;

    try {
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          id: fbUser.uid,
          name: userProfile.name,
          email: userProfile.emailOrPhone,
          role: userProfile.role,
          grade: userProfile.grade,
          rollNumberOrSection: userProfile.rollNumberOrSection,
          advaitCoins: userProfile.advaitCoins,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.warn('Could not write to Firestore directly (offline or rules):', e);
    }

    login(userProfile, assignedToken);
    return userProfile;
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    setIsTeacherPinVerified(false);
    logOutFirebase().catch(() => {});
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(TEACHER_VERIFIED_KEY);
    } catch {
      // ignore
    }
  };

  const updateGrade = (grade: GradeLevel) => {
    if (user) {
      setUser({ ...user, grade });
    }
  };

  // Verify Teacher Secret PIN through secure server endpoint
  const verifyTeacherPin = async (pin: string): Promise<{ success: boolean; error?: string; remainingSecs?: number }> => {
    try {
      const res = await fetch('/api/auth/verify-teacher-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid Security PIN',
          remainingSecs: data.remainingSecs,
        };
      }

      const verifiedToken = data.token || 'advait_teacher_master_session_2026';
      setAuthToken(verifiedToken);
      setIsTeacherPinVerified(true);

      try {
        localStorage.setItem(AUTH_TOKEN_KEY, verifiedToken);
        sessionStorage.setItem(TEACHER_VERIFIED_KEY, 'true');
      } catch {
        // ignore
      }

      if (user && user.role !== 'teacher') {
        setUser({
          ...user,
          role: 'teacher',
          name: user.name || 'Advait Insights Faculty',
        });
      } else if (!user) {
        setUser({
          id: 'user-teacher-advait',
          name: 'Advait Insights Faculty (Harsh Sir)',
          emailOrPhone: 'Advaitinsights1927@gmail.com',
          role: 'teacher',
          subjectSpecialty: 'Mathematics (Class 9 & 10)',
        });
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error verifying security PIN',
      };
    }
  };

  const unlockTeacherConsole = (token: string) => {
    setAuthToken(token);
    setIsTeacherPinVerified(true);
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      sessionStorage.setItem(TEACHER_VERIFIED_KEY, 'true');
    } catch {
      // ignore
    }
  };

  // Teacher role is only true if user role is teacher AND session is verified with valid token
  const isTeacher = Boolean(
    user?.role === 'teacher' &&
    authToken &&
    authToken.includes('teacher') &&
    isTeacherPinVerified
  );

  const advaitCoins = user?.advaitCoins ?? (user ? 15 : 0);

  const addAdvaitCoins = (amount: number, _reason?: string) => {
    if (!user) return;
    const current = user.advaitCoins ?? 15;
    const updatedCoins = Math.max(0, current + amount);
    const updatedUser: UserProfile = {
      ...user,
      advaitCoins: updatedCoins,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isAuthenticated: !!user,
        isTeacher,
        isTeacherPinVerified,
        advaitCoins,
        login,
        loginWithGoogle,
        logout,
        updateGrade,
        addAdvaitCoins,
        verifyTeacherPin,
        unlockTeacherConsole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
