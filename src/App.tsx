import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { BoardPage } from './pages/BoardPage'
import { AngleDetectPage } from './pages/AngleDetectPage'
import { WebRTCPage } from './pages/WebRTCPage'

import './App.css'

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/board">Board</Link>
        <Link to="/angle">AngleDetect</Link>
        <Link to="/webrtc">WebRTC</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/angle" element={<AngleDetectPage />} />
        <Route path="/webrtc" element={<WebRTCPage />} />
      </Routes>
    </Router>
  )
}

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Welcome Home</h1>
      <p>Go to Login to start Google OAuth2.0</p>
    </div>
  )
}

export default App
