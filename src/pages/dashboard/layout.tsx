import withAuth from "@/helpers/withAuth";
import NavbarComponent from "./NavbarComponent";
import React from "react";
import Head from "next/head";
interface LayoutProps {
    children: React.ReactNode;
  }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Wallboard Dashboard</title>
      </Head>
      <NavbarComponent />
      <div className="pt-16">{children}</div>
    </div>
  );
};

export default Layout;