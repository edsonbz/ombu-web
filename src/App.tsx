import './App.css';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/auth';
import LightsBackground from './LightsBackground';
import { Routing } from './routes';

function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen">
        <LightsBackground children={undefined} />
        <Routing />
        <Toaster richColors closeButton />
      </div>
    </AuthProvider>
  );
}

export default App;