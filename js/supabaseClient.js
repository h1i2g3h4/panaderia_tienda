// js/supabaseClient.js
const SUPABASE_URL = "https://fisqinuwnizrrppdskko.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpc3FpbnV3bml6cnJwcGRza2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNTg0OTEsImV4cCI6MjA3MTkzNDQ5MX0.7TmwNrJkuiw_8Hp-Fo4mueBpPU9YWsbkPi3EUXXqDME";
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
