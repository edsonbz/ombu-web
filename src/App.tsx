import './App.css';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/auth';
import LightsBackground from './LightsBackground';
import { Routing } from './routes';

function App() {
  return (
    <AuthProvider>
      <Routing />
      <LightsBackground children={undefined}/>
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}

export default App;