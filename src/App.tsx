import './App.css';
import { AuthProvider } from './context/auth';
import { Routing } from './routes';

function App() {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

export default App;