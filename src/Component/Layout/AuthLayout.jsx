"use client";

import { createContext, useContext } from "react";

const AuthBrandingContext = createContext(null);

export function useAuthBranding() {
  return useContext(AuthBrandingContext);
}

export default function AuthLayout({ children, branding }) {
  return (
    <AuthBrandingContext.Provider value={branding}>
      <div className="min-h-screen" style={{ backgroundColor: branding?.surfaceColor || "#F7F3EC" }}>
        {children}
      </div>
    </AuthBrandingContext.Provider>
  );
}
