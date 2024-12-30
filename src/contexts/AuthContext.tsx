"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  UserCredential,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import { IAdmin, IUser } from "@/types/account";
import { message } from "antd";
import {
  clientSetCookie,
  getClientCookie,
  clearCookie,
  SupportedKeys,
} from "@/utils/cookies";
import FirebaseHelper from "@/helpers/FirebaseHelper";
import dayjs from "dayjs";
import { COLLECTIONS } from "@/firebase/collections";

interface AuthContextType {
  admin: IAdmin | null | undefined;
  isAdmin: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  loggingIn: boolean;
  googleLoggingIn: boolean;
  loading: boolean;
  userData: IUser | null;
  setUser: (user: IUser | null) => void;
  signup: (params: { email: string; password: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  admin: undefined,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  googleLogin: async () => {},
  loggingIn: false,
  googleLoggingIn: false,
  loading: true,
  userData: null,
  setUser: () => {},
  signup: async () => {},
  forgotPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<IAdmin | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUser | null>(null);

  const AUTH_COOKIE_KEY: SupportedKeys = "Authorization";

  const handleLoginUser = useCallback(async (user: UserCredential) => {
    const token = await user.user.getIdToken();
    clientSetCookie({ key: AUTH_COOKIE_KEY, data: token });

    const users = await FirebaseHelper.findWithFilter<IUser>(
      "users",
      "email",
      user.user.email || "",
    );
    const userDoc = users.find((doc) => doc.email === user.user.email);
    if (userDoc) {
      setUserData(userDoc);
      setIsAdmin(false);
    } else {
      const admins = await FirebaseHelper.find<IAdmin>(COLLECTIONS.admins);
      const admin = admins.find(
        (admin) =>
          admin.email?.toLowerCase() === user.user.email?.toLowerCase(),
      );

      if (admin) {
        const adminData = {
          ...admin,
          isAdmin: true,
        } as IAdmin;
        setAdmin(adminData);
        setIsAdmin(true);
        setUserData(null);
      } else {
        const created = await FirebaseHelper.create(COLLECTIONS.users, {
          email: user.user.email || "",
          name: user.user.displayName || "",
          profileImage: user.user.photoURL,
          createdAt: dayjs().toISOString(),
          updatedAt: dayjs().toISOString(),
        } as IUser);
        const userDoc = await FirebaseHelper.findOne<IUser>(
          COLLECTIONS.users,
          created.id,
        );
        if (userDoc) {
          setUserData(userDoc);
          setIsAdmin(false);
        }
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setAdmin(null);
      setIsAdmin(false);
      clearCookie(AUTH_COOKIE_KEY);
      window.open(window.location.href, "_self");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoggingIn(true);
      const resp = await signInWithEmailAndPassword(auth, email, password);

      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.includes("google.com")) {
        const provider = new GoogleAuthProvider();
        const googleResp = await signInWithPopup(auth, provider);
        const googleCredential =
          GoogleAuthProvider.credentialFromResult(googleResp);
        await linkWithCredential(resp.user, googleCredential!);
        message.success("Email/Password account linked with Google account!");
      }

      await handleLoginUser(resp);
      setLoggingIn(false);
    } catch (error) {
      console.error("Error signing in: ", error);
      setLoggingIn(false);
      message.error({ content: "Invalid email or password" });
    }
  };

  const signup = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const resp = await createUserWithEmailAndPassword(auth, email, password);
      await handleLoginUser(resp);
      setLoading(false);
    } catch (error) {
      console.error("Error signing up: ", error);
      setLoading(false);
      message.error({ content: "Invalid email or password" });
    }
  };

  const googleLogin = async () => {
    setGoogleLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const resp = await signInWithPopup(auth, provider);

      const email = resp.user.email;
      const methods = await fetchSignInMethodsForEmail(auth, email!);

      if (methods.includes("password")) {
        const password = prompt("Enter your password to link your accounts:");
        if (password) {
          const credential = EmailAuthProvider.credential(email!, password);
          await linkWithCredential(resp.user, credential);
          message.success(
            "Google account linked with your Email/Password account!",
          );
        }
      }

      await handleLoginUser(resp);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    } finally {
      setGoogleLoggingIn(false);
    }
  };

  const checkForTokenOnLoad = useCallback(async () => {
    const token = getClientCookie(AUTH_COOKIE_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await new Promise<UserCredential>(
        (resolve, reject) => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              resolve({ user } as UserCredential);
            } else {
              reject(new Error("User not found"));
            }
          });
        },
      );
      await handleLoginUser(userCredential);
    } catch (error) {
      setUser(null);
      setLoading(false);
      console.error("Failed to re-authenticate user: ", error);
      clearCookie(AUTH_COOKIE_KEY);
    }
  }, [handleLoginUser]);

  const forgotPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.href,
    });
  };

  useEffect(() => {
    checkForTokenOnLoad();
  }, [checkForTokenOnLoad]);

  const setUser = (user: IUser | null) => {
    setUserData(user);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAdmin,
        login,
        logout,
        googleLogin,
        loggingIn,
        googleLoggingIn,
        loading,
        userData,
        setUser,
        signup,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
