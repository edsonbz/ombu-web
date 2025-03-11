import { Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './pages/login/LoginView';
import LoginForm from './pages/login/login-form/LoginForm';


export default function UnauthenticatedContent() {
	return (
		<Routes>
			<Route
				path="/login"
				element={
					<LoginView>
						<LoginForm />                        
					</LoginView>
				}
			/>
			{/* <Route
				path="/create-account"
				element={
					<SingleCard title="Registrarse">
						<CreateAccountForm />
					</SingleCard>
				}
			/>
			<Route
				path="/reset-password"
				element={
					<SingleCard
						title="Restrablecer Contraseña"
						description="Por favor, ingresa la dirección de correo electrónico que utilizaste para registrarte, y te enviaremos un enlace para restablecer tu contraseña por correo electrónico."
					>
						<ResetPasswordForm />
					</SingleCard>
				}
			/>
			<Route
				path="/change-password/:recoveryCode"
				element={
					<SingleCard title="Cambiar Contraseña">
						<ChangePasswordForm />
					</SingleCard>
				}
			/> */}
			<Route path="*" element={<Navigate to={'/login'} />}></Route>
		</Routes>
	);
}
