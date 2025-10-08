/* Import des modules CSS */
import "./App.css";

/* Import des composants React */
import { Outlet } from "react-router-dom";

/*! @preserve
 * @signature: Ryan-DECIAN_ExpressPowerFlow | App.tsx
 * Copyright (c) 2025 Ryan DECIAN
 */

function App() {
  return (
    <div className="AppContainer">
      <Outlet />
    </div>
  );
}

export default App;
