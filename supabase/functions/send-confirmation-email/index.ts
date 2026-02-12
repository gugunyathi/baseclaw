import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, walletAddress, llmProvider } = await req.json();

    if (!email || !walletAddress || !llmProvider) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const providerLabels: Record<string, string> = {
      anthropic: "Anthropic Claude",
      openai: "OpenAI GPT",
      google: "Google Gemini",
    };

    const providerLabel = providerLabels[llmProvider] || llmProvider;
    const shortWallet = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

    // For now, log the email that would be sent.
    // In production, integrate with Resend, SendGrid, or similar.
    console.log(`📧 Confirmation email to: ${email}`);
    console.log(`   Wallet: ${shortWallet}`);
    console.log(`   Provider: ${providerLabel}`);

    const emailContent = {
      to: email,
      subject: "🦀 BaseClaw – Your AI Agent Deployment is Confirmed!",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e6edf3; padding: 32px; border-radius: 12px;">
          <h1 style="color: #00d4ff; font-size: 24px; margin-bottom: 8px;">🦀 BaseClaw</h1>
          <p style="color: #8b949e; font-size: 14px; margin-bottom: 24px;">Your AI Agent deployment is confirmed!</p>
          
          <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #8b949e; padding: 8px 0; font-size: 14px;">Wallet</td>
                <td style="color: #e6edf3; padding: 8px 0; font-size: 14px; text-align: right; font-family: monospace;">${shortWallet}</td>
              </tr>
              <tr>
                <td style="color: #8b949e; padding: 8px 0; font-size: 14px;">LLM Provider</td>
                <td style="color: #e6edf3; padding: 8px 0; font-size: 14px; text-align: right;">${providerLabel}</td>
              </tr>
              <tr>
                <td style="color: #8b949e; padding: 8px 0; font-size: 14px;">Payment</td>
                <td style="color: #e6edf3; padding: 8px 0; font-size: 14px; text-align: right;">12 USDC (Base L2)</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #e6edf3; font-size: 14px; line-height: 1.6;">
            We'll manually deploy your OpenClaw instance within <strong>24 hours</strong> and email you your Telegram bot link and dashboard credentials.
          </p>
          
          <p style="color: #8b949e; font-size: 12px; margin-top: 32px; border-top: 1px solid #30363d; padding-top: 16px;">
            Questions? Reply to this email or join our Telegram support group.
          </p>
        </div>
      `,
    };

    // Log the full email payload for debugging
    console.log("Email payload:", JSON.stringify(emailContent, null, 2));

    return new Response(
      JSON.stringify({ success: true, message: "Confirmation email queued", emailContent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
