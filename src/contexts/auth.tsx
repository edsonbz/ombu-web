import React, { useState, createContext, useContext, useCallback, useMemo } from 'react';
import { login } from '@/api/auth';
import { AuthContextType } from '@/types';

type AuthProviderProps = Readonly<React.PropsWithChildren<unknown>>;
function AuthProvider(props: AuthProviderProps) {
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(true);




	const signIn = useCallback(async (email: string, password: string) => {
		const result = await login(email, password);
		if (result) {
			setUser(result);
		}else {
			setLoading(false);
		}
		return result;
	}, []);

	const signOut = useCallback(() => {
		setUser(undefined);
		sessionStorage.removeItem('user_access_token');
		sessionStorage.removeItem('realm_access_token');
		localStorage.removeItem('selectedEnvironment');
	}, []);

	const authValue = useMemo(() => ({ user, signIn, signOut, loading }), [user, signIn, signOut, loading]);

	return <AuthContext.Provider value={authValue} {...props} />;
}

const AuthContext = createContext<AuthContextType>({
	loading: false,
} as AuthContextType);
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
