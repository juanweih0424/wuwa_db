import roverdrag from "../assets/images/stickers/rover_drag.webp"
import '../assets/css/notfound.css'
import { Link } from "react-router-dom";

function Notfound(){
    
    return (
        <div className="flex min-h-full min-w-full flex-col justify-center items-center gap-6 px-4 py-8"> 
            <img src={roverdrag} className="w-50 h-50"/>
            <p className="font-bold text-3xl text-center">oops ... 404 Not Found</p>
            <p className="font-base text-xl text-center">The page you are looking for does not exist or an error occurred</p>
            <p className="goback">
                <Link to="/">Go Back to Home Page</Link>
            </p>
        </div>
    );
}

export default Notfound;