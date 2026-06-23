import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing isDark={isDark} setIsDark={setIsDark} />} />
        <Route
          path="/dashboard"
          element={<Dashboard isDark={isDark} setIsDark={setIsDark} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
