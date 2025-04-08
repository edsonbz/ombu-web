import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { login } from "../api/auth";
import { AuthContextType, AuthUser } from "../types/auth";

type AuthProviderProps = Readonly<React.PropsWithChildren<unknown>>;

const AuthContext = createContext<AuthContextType>({
  loading: false,
} as AuthContextType);

function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  // ✅ Cargar datos y validar token
  useEffect(() => {
    const storedToken = sessionStorage.getItem("user_access_token");
    const storedUser = sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode<{ exp: number }>(storedToken);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          signOut();
        } else {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        signOut();
      }
    }

    setLoading(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(undefined);
    setToken(undefined);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("user_access_token");
    sessionStorage.removeItem("realm_access_token");
    localStorage.removeItem("selectedEnvironment");
  }, []);
  // ✅ Inactividad con toast y cuenta regresiva
  useEffect(() => {
    if (!token) return;

    let inactivityTimeout: ReturnType<typeof setTimeout>;
    let countdownInterval: ReturnType<typeof setInterval>;
    let countdown = 60;
    let toastId: string | number;

    const resetInactivity = () => {
      clearTimeout(inactivityTimeout);
      clearInterval(countdownInterval);
      toast.dismiss("session-timeout");

      inactivityTimeout = setTimeout(() => {
        toastId = toast.info(`Inactividad detectada. Cerrando sesión en ${countdown} seg...`, {
          id: "session-timeout",
          duration: 60000,
        });

        countdownInterval = setInterval(() => {
          countdown--;
          toast.dismiss("session-timeout");
          toast(`Inactividad detectada. Cerrando sesión en ${countdown} seg...`, {
            id: "session-timeout",
            duration: 60000,
          });

          if (countdown <= 0) {
            clearInterval(countdownInterval);
            toast.dismiss("session-timeout");
            signOut();
          }
        }, 1000);
      }, 1 * 60 * 1000); // ⏳ 5 minutos
    };

    window.addEventListener("mousemove", resetInactivity);
    window.addEventListener("keydown", resetInactivity);
    window.addEventListener("touchstart", resetInactivity); // ✅ para móviles

    resetInactivity();

    return () => {
      clearTimeout(inactivityTimeout);
      clearInterval(countdownInterval);
      toast.dismiss("session-timeout");
      window.removeEventListener("mousemove", resetInactivity);
      window.removeEventListener("keydown", resetInactivity);
      window.removeEventListener("touchstart", resetInactivity);
    };
  }, [token, signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await login(email, password);
    if (result) {
      setUser(result.user);
      setToken(result.token);

      sessionStorage.setItem("user", JSON.stringify(result.user));
      sessionStorage.setItem("user_access_token", result.token);
    } else {
      setLoading(false);
    }
    return result;
  }, []);



  const authValue = useMemo(
    () => ({ user, token, signIn, signOut, loading }),
    [user, token, signIn, signOut, loading]
  );

  return <AuthContext.Provider value={authValue} {...props} />;
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
