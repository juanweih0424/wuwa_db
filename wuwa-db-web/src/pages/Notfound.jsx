import roverdrag from "../assets/images/stickers/rover_drag.webp"
import '../assets/css/notfound.css'
import { Link } from "react-router-dom";

function Notfound(){
    
    return (
        <section className="main_body">
            <img src={roverdrag} className="rover_drag"/>
            <h1 className="error">oops ... 404 Not Found</h1>
            <p className="errormsg">The page you are looking for does not exist or an error occurred</p>
            <p className="goback">
                <Link to="/">Go Back to Home Page</Link>
            </p>
        </section>
    );
}

export default Notfound;