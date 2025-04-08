export type AuthUser = {
	id: string;
	name: string;
	email: string;
  };
  
  export type AuthContextType = {
	user?: AuthUser;
	token?: string;
	signIn: (email: string, password: string) => Promise<any>;
	signOut: () => void;
	loading: boolean;
  };
  