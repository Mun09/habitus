import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "@/components/settings/settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?next=/settings");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // If a brand-new user lands here before onboarding finished, send
  // them to onboarding so the row gets created first.
  if (!profile) redirect("/onboarding");

  return (
    <div className="px-5 md:px-8 py-12 md:py-20 max-w-2xl mx-auto">
      <SettingsClient email={user.email ?? ""} profile={profile} />
    </div>
  );
}
