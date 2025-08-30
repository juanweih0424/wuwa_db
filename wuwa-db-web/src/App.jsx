import { Routes, Route, Navigate} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Characters from "./pages/Characters.jsx";
import Notfound from "./pages/Notfound.jsx"
import Echoes from "./pages/Echoes.jsx"
import Weapons from "./pages/Weapons.jsx"
import WeaponDetail from "./pages/WeaponDetail.jsx";
function App(){
    
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<Home />} />
                <Route path="home" element={<Navigate to="/" replace />} />
                <Route path="/characters" element={<Characters/>} />
                <Route path="/echoes" element={<Echoes/>} />
                <Route path="/weapons" element={<Weapons/>} />
                <Route path="/weapons/:slug" element={<WeaponDetail />} />
                <Route path="*" element={<Notfound />} />

            </Route>
        </Routes>
    );
}

export default App;