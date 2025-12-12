import { createFileRoute, redirect } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/landing_page";
import { PageContainer } from "@/components/layout/page_container";

export const Route = createFileRoute("/")({
	component: HomePage,
	beforeLoad: async ({ context }) => {
		// If not authenticated, redirect to login
		const { userId } = context as { userId: string | null };
		if (!userId) {
			throw redirect({ to: "/login" });
		}
	},
});

function HomePage() {
	return (
		<PageContainer>
			<LandingPage />
		</PageContainer>
	);
}
