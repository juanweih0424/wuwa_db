import React from "react";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-svh flex flex-col">
      <Nav />
      <main className="flex flex-1" role="main">
        <Outlet />
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}