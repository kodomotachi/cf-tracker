import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './pages/Home/Home'

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
    </Routes>
  </Router>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App