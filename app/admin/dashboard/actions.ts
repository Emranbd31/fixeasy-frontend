"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerServiceRoleClient } from "@/lib/supabaseClient";

export async function setProfessionalVerified(formData: FormData) {
  const userId = String(formData.get("user_id") || "").trim();
  const verifiedRaw = String(formData.get("verified") || "").trim().toLowerCase();
  const verified = verifiedRaw === "true" || verifiedRaw === "1" || verifiedRaw === "yes";

  if (!userId) return;

  const supabase = createSupabaseServerServiceRoleClient() as any;
  await supabase.from("professionals").update({ verified }).eq("user_id", userId);

  revalidatePath("/admin/dashboard");
}

