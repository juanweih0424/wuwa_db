import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

function Layout(){

    return (
        <div className="app">
            <Nav />
                <main className="main">
                    <Outlet />  
                </main>
            <Footer />
        </div>
    );
}

export default Layout;
    