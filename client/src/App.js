import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Register from './pages/registerLogin/Register';
import Home from './pages/home/Home';
import Login from './pages/registerLogin/Login';
import Profile from './pages/profile/Profile';
import Members from './pages/members/Members';
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
          <Route path='/users' element={isAuth ? <Members /> : <Navigate to={"/"} />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
