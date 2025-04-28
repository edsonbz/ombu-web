export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role: "admin" | "cashier"; 
  };
  
  export type AuthContextType = {
	user?: AuthUser;
	token?: string;
	signIn: (email: string, password: string) => Promise<any>;
	signOut: () => void;
	loading: boolean;
  };
  