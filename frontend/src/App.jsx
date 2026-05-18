import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './views/Dashboard';
import TeamProfile from './views/TeamProfile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profil" element={<TeamProfile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
