import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import PageTransition from './components/PageTransition';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <BrowserRouter>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Landing isDark={isDark} setIsDark={setIsDark} />} />
          <Route
            path="/dashboard"
            element={<Dashboard isDark={isDark} setIsDark={setIsDark} />}
          />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}
