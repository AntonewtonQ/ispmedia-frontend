import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/context/AuthContext";
import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
};

export default RootLayout;
