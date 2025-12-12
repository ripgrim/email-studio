import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/tanstack-react-start";

export function Header() {
	const links = [
		{ to: "/", label: "Editor" },
		{ to: "/templates", label: "Templates" },
		{ to: "/inspirations", label: "Inspirations" },
	] as const;

	return (
		<header className="border-b bg-background">
			<div className="flex flex-row items-center justify-between px-4 py-2">
				<nav className="flex gap-4 text-sm font-medium">
					{links.map(({ to, label }) => {
						return (
							<Link
								key={to}
								to={to}
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<UserButton />
				</div>
			</div>
		</header>
	);
}
