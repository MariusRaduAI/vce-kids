"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.replace("/login");
      }}
      className="text-sm text-neutral-500 transition hover:text-neutral-900 dark:hover:text-white"
    >
      Ieși din cont
    </button>
  );
}
