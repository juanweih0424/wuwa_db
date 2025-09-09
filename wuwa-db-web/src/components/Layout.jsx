import React from "react";
import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app">
      <Nav />
      <main className="main" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}