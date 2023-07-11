import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Register from './pages/Register';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Users from './components/Users';
import "./App.css"
import { useSelector } from 'react-redux';


function App() {
  const isAuth = Boolean(useSelector((state) => state.token))
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile/:id' element={isAuth ? <Profile /> : <Navigate to={"/"} />} />
          <Route path='/home' element={isAuth ? <Home /> : <Navigate to={'/'} />} />
          <Route path='/users' element={isAuth ? <Users /> : <Navigate to={"/"} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
