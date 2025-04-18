import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Problems from "./pages/Problems";
import Contests from "./pages/Contests";
import Header from "./components/Header";

const App = () => {
  const [dataUser, setDataUser] = useState([]);

  const codeforce = "https://codeforces.com";
  const tachi = "https://getdata-codeforces.onrender.com";

  const handleHandleUser = (value) => {
    setDataUser(value);
  };
  return (
    <div>
      <Router>
        <Header
          tachi={tachi}
          codeforce={codeforce}
          propHandleUser={handleHandleUser}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/problems" replace />} />
          <Route
            path="/problems"
            exact
            element={
              <Problems
                codeforce={codeforce}
                tachi={tachi}
                dataUser={dataUser}
              />
            }
          />
          <Route
            path="/contests"
            exact
            element={
              <Contests
                codeforce={codeforce}
                tachi={tachi}
                dataUser={dataUser}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
