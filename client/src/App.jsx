import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import './App.css'

const routes = (
  <Router>
    <Routes>
      <Route path='/dashboard' exact element={<Home />} />
      <Route path='/' exact element={<Login />} />
      <Route path='/signup' exact element={<SignUp />} />
    </Routes>
  </Router>
)

function App() {
  return (
    <div>{routes}</div>
  )
}

export default App
