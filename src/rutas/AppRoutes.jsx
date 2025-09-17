import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import Home from '../paginas/home/Home';
import { Cliente404 } from '../paginas/404cliente/Cliente404';
import { Empleado404 } from '../paginas/404empleado/Empleado404';
import { PanelAdmin } from '../paginas/panelAdmin/PanelAdmin';
import { PanelCliente } from '../paginas/panelCliente/PanelCliente';
import { PanelEmpleado } from '../paginas/panelEmpleado/PanelEmpleado';

const AppRoutes = () => {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path="/*" element={<Home />}/>
                    <Route path="/404cli" element={<Cliente404 />}/>
                    <Route path="/404emp" element={<Empleado404 />}/>
                    <Route path="/admin" element={<PanelAdmin />}/>
                    <Route path="/cliente" element={<PanelCliente />}/>
                    <Route path="/empleado" element={<PanelEmpleado />}/>
                </Routes>
            </HashRouter>
        </>
    )
}

export default AppRoutes;