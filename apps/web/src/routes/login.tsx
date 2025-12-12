import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	beforeLoad: async ({ context }) => {
		// If already authenticated, redirect to home
		const { userId } = context as { userId: string | null };
		if (userId) {
			throw redirect({ to: "/" });
		}
	},
});

function LoginPage() {
	return (
		<div className="flex h-full items-center justify-center p-4">
			<div className="w-full max-w-md">
				<SignIn />
			</div>
		</div>
	);
}
