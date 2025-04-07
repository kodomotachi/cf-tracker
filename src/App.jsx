import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Problems from "./pages/Problems";
import Header from "./components/Header";

const routes = (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Navigate to="/problems" replace />} />
      <Route path="/problems" exact element={<Problems />} />
    </Routes>
  </Router>
);

const App = () => {
  return <div>{routes}</div>;
};

export default App;
