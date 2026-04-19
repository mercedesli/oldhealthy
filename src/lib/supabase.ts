import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rzqnkujbjshdeopznpef.supabase.co";
const SUPABASE_KEY = "sb_publishable_HktBTeAeNOC46H3CbJsdig_e6RnzOZB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/** Devuelve (o genera) un UUID de dispositivo guardado en localStorage. */
export function getUserId(): string {
  try {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }
    return id;
  } catch {
    return "anonimo";
  }
}
