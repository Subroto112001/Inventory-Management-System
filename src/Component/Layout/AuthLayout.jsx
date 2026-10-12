"use client";

import { createContext, useContext } from "react";

const AuthBrandingContext = createContext(null);

export function useAuthBranding() {
  return useContext(AuthBrandingContext);
}

export default function AuthLayout({ children, branding }) {
  return (
    <AuthBrandingContext.Provider value={branding}>
      <div className="min-h-screen" style={{ backgroundColor: branding?.backgroundColor || "#F1F3F5" }}>
        {children}
      </div>
    </AuthBrandingContext.Provider>
  );
}
