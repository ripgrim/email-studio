"use client";

import { Link, useLocation } from "@tanstack/react-router";
import { UserButton } from "@clerk/tanstack-react-start";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from "@/components/ui/sidebar";
import { FolderTree } from "@/components/templates/folder_tree";
import { ChatsList } from "@/components/chats/chats_list";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, File01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { SidebarToggleIcon } from "@/components/icons/sidebar-toggle";

const menuItems = [
	{
		title: "Home",
		url: "/",
		icon: Home01Icon,
	},
	{
		title: "Templates",
		url: "/templates",
		icon: File01Icon,
	},
	{
		title: "Inspirations",
		url: "/inspirations",
		icon: SparklesIcon,
	},
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	return (
		<SidebarProvider>
			<Sidebar className="border-r border-sidebar-border bg-sidebar-background" collapsible="icon">
				<SidebarHeader className="flex flex-row group-data-[collapsible=icon]:flex-col items-center justify-between group-data-[collapsible=icon]:justify-start border-b border-sidebar-border px-3 py-2 group-data-[collapsible=icon]:py-2">
					<div className="flex items-center gap-2.5">
						<div className="flex h-5 w-5 items-center justify-center rounded text-xs font-semibold text-sidebar-foreground bg-sidebar-accent/50">
							E
						</div>
						<span className="text-xs font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
							Email Studio
						</span>
					</div>
					<SidebarTrigger className="h-6 w-6 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors group-data-[collapsible=icon]:mt-1.5 group-data-[collapsible=icon]:self-center">
					</SidebarTrigger>
				</SidebarHeader>
				<SidebarContent className="px-1.5 py-2">
					<SidebarGroup>
						<SidebarGroupLabel className="px-2.5 text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-1.5">
							Navigation
						</SidebarGroupLabel>
						<SidebarMenu className="space-y-0.5">
							{menuItems.map((item) => {
								const Icon = item.icon;
								const isActive = location.pathname === item.url || 
									(item.url !== "/" && location.pathname.startsWith(item.url));
								
								return (
									<SidebarMenuItem key={item.url}>
										<SidebarMenuButton 
											asChild 
											isActive={isActive}
											className="h-7 rounded-md px-2.5 text-xs text-sidebar-foreground/70 hover:!bg-sidebar-accent hover:!text-sidebar-accent-foreground hover:!font-medium data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium transition-colors"
										>
											<Link to={item.url}>
												<HugeiconsIcon icon={Icon} className="size-3.5 shrink-0" />
												<span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
					<SidebarGroup className="mt-3">
						<SidebarGroupLabel className="px-2.5 text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-1.5">
							Chats
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<ChatsList />
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup className="mt-3">
						<SidebarGroupLabel className="px-2.5 text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-wider mb-1.5">
							Templates
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<FolderTree />
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className="border-t border-sidebar-border p-2">
					<div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center">
						<UserButton />
					</div>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<div className="flex h-screen w-full flex-col overflow-hidden min-w-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

