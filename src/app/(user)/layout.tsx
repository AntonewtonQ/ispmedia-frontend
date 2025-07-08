import { UserNavbar } from "@/components/usernavbar";
import { AuthProvider } from "@/context/AuthContext";
import React, { ReactNode } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <UserNavbar />
      {children}
    </AuthProvider>
  );
};

export default UserLayout;
