

interface NavigationData {
	currentPath: string;
}

export type NavigationContextType = {
	setNavigationData?: ({ currentPath }: NavigationData) => void;
	navigationData: NavigationData;
};

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
}

export interface AuthContextType {
	user?: User;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<{ token: string, user: User } | null>;
	signOut: () => void;
}
