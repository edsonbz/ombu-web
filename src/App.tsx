import './App.css';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/auth';
import { Routing } from './routes';

function App() {
  return (
    <AuthProvider>
      <Routing />
      <Toaster richColors closeButton />
    </AuthProvider>
  );
}

export default App;