import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import type { NavigationContextType } from '../types';

const NavigationContext = createContext<NavigationContextType>({} as NavigationContextType);
const useNavigation = () => useContext(NavigationContext);

type NavigationProviderProps = Readonly<React.PropsWithChildren<unknown>>;
function NavigationProvider(props: NavigationProviderProps) {
	const [navigationData, setNavigationData] = useState({ currentPath: '' });
	const navigationValue = useMemo(() => ({ navigationData, setNavigationData }), [navigationData, setNavigationData]);

	return <NavigationContext.Provider value={navigationValue} {...props} />;
}

function withNavigationWatcher(Component: React.ElementType, path: string) {
	const WrappedComponent = function (props: Record<string, unknown>) {
		const { setNavigationData } = useNavigation();

		useEffect(() => {
			setNavigationData!({ currentPath: path });
		}, [setNavigationData]);

		return <Component {...props} />;
	};
	return <WrappedComponent />;
}

export { NavigationProvider, useNavigation, withNavigationWatcher };
