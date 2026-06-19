import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { MainMenu } from '@/pages/MainMenu';
import { Game } from '@/pages/Game';

function AppContent() {
  const navigate = useNavigate();

  const handleStartGame = (level: number) => {
    navigate(`/game/${level}`);
  };

  return (
    <Routes>
      <Route path="/" element={<MainMenu onStartGame={handleStartGame} />} />
      <Route path="/game/:level" element={<Game />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
