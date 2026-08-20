import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { password } = await request.json();
    const adminPassword = Deno.env.get("ADMIN_RESET_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!adminPassword || !supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Missing server configuration" }, 500);
    }

    if (!password || password !== adminPassword) {
      return jsonResponse({ error: "管理员密码错误" }, 401);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { error } = await adminClient
      .from("blind_boxes")
      .update({
        opened: false,
        opened_at: null,
      })
      .neq("id", 0);

    if (error) {
      return jsonResponse({ error: "数据库重置失败" }, 500);
    }

    return jsonResponse({ success: true }, 200);
  } catch (_error) {
    return jsonResponse({ error: "请求格式无效" }, 400);
  }
});

function jsonResponse(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
