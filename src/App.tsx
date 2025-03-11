import { HashRouter as Router } from 'react-router-dom';
import UnauthenticatedContent from "./UnauthenticatedContent";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from './contexts/auth';
import Content from './Content';
import '@/pages/login/LoginView.css';

const useAxiosInterceptor = () => {

}

  function App() {
	const { user } = useAuth();

	// Configurar los interceptores de Axios al cargar la app
	useAxiosInterceptor();

	if (user) {
		return (
			<div className="flex">
				<Content />
			</div>
		);
	}

	return <UnauthenticatedContent />;
}

export default function Root() {



	return (
		<Router>
			<AuthProvider>
				<NavigationProvider>
					<>
						<div className="light x1"></div>
						<div className="light x2"></div>
						<div className="light x3"></div>
						<div className="light x4"></div>
						<div className="light x5"></div>
						<div className="light x6"></div>
						<div className="light x7"></div>
						<div className="light x8"></div>
						<div className="light x9"></div>
						<div className='flex items-center justify-center h-screen w-screen bg-gradient-to-b from-secondary to-tertiary'>
							<App />
						</div>
					</>
				</NavigationProvider>
			</AuthProvider>
		</Router>
	);
}