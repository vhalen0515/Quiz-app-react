import React from "react"
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom"
import HomePage from "./components/HomePage"
import QuizPage from "./components/QuizPage"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </Router>
  )
}