import { mutation } from "./_generated/server";

// Seed inspiration templates
export const seedInspirations = mutation({
	handler: async (ctx) => {
		const existing = await ctx.db.query("inspirations").first();
		if (existing) {
			return { message: "Inspirations already seeded" };
		}

		const inspirations = [
			{
				slug: "welcome-modern",
				name: "Modern Welcome Email",
				description: "A clean, modern welcome email template",
				category: "Welcome",
				tags: ["welcome", "modern", "clean"],
				code: `import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Section style={{ padding: '20px', textAlign: 'center' }}>
            <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome!</Text>
            <Text>We're excited to have you on board.</Text>
            <Button href="https://example.com" style={{ backgroundColor: '#0070f3', color: 'white', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none' }}>
              Get Started
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}`,
			},
			{
				slug: "newsletter-classic",
				name: "Classic Newsletter",
				description: "A traditional newsletter layout",
				category: "Newsletter",
				tags: ["newsletter", "classic", "content"],
				code: `import { Html, Head, Body, Container, Section, Text, Heading } from '@react-email/components';

export default function NewsletterEmail() {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Georgia, serif' }}>
        <Container>
          <Section style={{ padding: '20px' }}>
            <Heading>Monthly Newsletter</Heading>
            <Text>Here's what's new this month...</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}`,
			},
			{
				slug: "promotion-bold",
				name: "Bold Promotion",
				description: "Eye-catching promotional email",
				category: "Promotion",
				tags: ["promotion", "bold", "cta"],
				code: `import { Html, Head, Body, Container, Section, Text, Button } from '@react-email/components';

export default function PromotionEmail() {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>
        <Container>
          <Section style={{ padding: '40px', backgroundColor: 'white', borderRadius: '8px', margin: '20px 0' }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b6b' }}>Special Offer!</Text>
            <Text style={{ fontSize: '18px', margin: '20px 0' }}>Get 50% off today only!</Text>
            <Button href="https://example.com/shop" style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '16px 32px', borderRadius: '4px', textDecoration: 'none', fontSize: '18px' }}>
              Shop Now
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}`,
			},
		];

		for (const inspiration of inspirations) {
			await ctx.db.insert("inspirations", inspiration);
		}

		return { message: `Seeded ${inspirations.length} inspirations` };
	},
});



