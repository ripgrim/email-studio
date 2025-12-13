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
						<div className="flex h-5 w-5 items-center justify-center rounded text-xs font-semibold text-sidebar-foreground">
							<svg width="22" height="22" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path opacity="0.5" d="M0 90.9294L43.0709 134L55.4167 68.1611C55.7302 66.489 55.1984 64.7698 53.9954 63.5669L19.7548 29.3272C16.8242 26.3967 11.8088 27.9483 11.045 32.0218L0 90.9294Z" fill="#8161FF" />
								<path d="M43.072 134L0.00113678 90.9288L65.8393 78.5842C67.5114 78.2706 69.2305 78.8025 70.4334 80.0054L104.674 114.245C107.605 117.175 106.053 122.191 101.979 122.955L43.072 134Z" fill="#8161FF" />
								<path opacity="0.5" d="M90.9291 0L134.001 43.0721L68.1618 55.4168C66.4897 55.7303 64.7707 55.1984 63.5677 53.9955L29.3281 19.7559C26.3975 16.8253 27.949 11.8098 32.0225 11.046L90.9291 0Z" fill="#8161FF" />
								<path d="M78.5864 65.8407C78.2729 67.5128 78.8047 69.2319 80.0077 70.4348L114.247 104.674C117.178 107.605 122.193 106.053 122.957 101.98L134.002 43.0723L90.9311 0.00140381L78.5864 65.8407Z" fill="#8161FF" />
							</svg>
						</div>
						<span className="text-xs font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
							studio <p className="text-xs font-normal text-sidebar-foreground/50">by Inbound</p>
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

