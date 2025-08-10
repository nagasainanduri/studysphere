import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterUser from './pages/RegisterUser';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/ui/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route element={<MainLayout />}>
          <Route path='/home' element={<HomePage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Route>
        <Route path='*' element={<div style={{ color: '#ff5555', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center', marginTop: '3rem' }}>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
