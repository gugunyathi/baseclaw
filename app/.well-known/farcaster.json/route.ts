function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;
  
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    miniapp: {
      version: "1",
      name: "BaseClaw",
      homeUrl: URL,
      iconUrl: `${URL}/assets/blue crab icon.png`,
      splashImageUrl: `${URL}/assets/blue crab icon.png`,
      splashBackgroundColor: "#0F1419",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "Launch your AI Agent in 60 seconds",
      description: "Deploy your private BaseClaw AI agent instance. Pay once with USDC on Base. No servers, no SSH. Runs 24/7.",
      screenshotUrls: [],
      primaryCategory: "productivity",
      tags: ["ai", "agent", "base", "crypto"],
      heroImageUrl: `${URL}/og-image.png`,
      tagline: "BaseClaw AI Agent in 60 seconds",
      ogTitle: "BaseClaw - Launch your AI Agent in 60 seconds",
      ogDescription: "Deploy your private BaseClaw instance. Pay once with USDC on Base. No servers, no SSH. Runs 24/7.",
      ogImageUrl: `${URL}/og-image.png`,
      noindex: false
    }
  };

  return Response.json(manifest);
}
