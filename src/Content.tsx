import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './pages/sideBar/SideBar';
import { Navigation } from 'lucide-react';
import HomeView from './pages/home/HomeView';

export default function Content() {
	return (
		<div>
			/*
			<SidebarProvider open={true}>
				<SidebarTrigger>
					<AppSidebar />
					<div className="p-4">
						<Navigation />
					</div>
				</SidebarTrigger>
			</SidebarProvider>
			*/
			<HomeView />
		</div>

	);
}
