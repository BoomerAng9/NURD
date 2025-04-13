import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SupabaseProvider } from "./components/ui/supabase-provider";

// Add font imports
const fontLinks = document.createElement('link');
fontLinks.rel = 'stylesheet';
fontLinks.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;700&display=swap';
document.head.appendChild(fontLinks);

// Add title
const title = document.createElement('title');
title.textContent = 'NURD Summer Initiative';
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(
  <SupabaseProvider>
    <App />
  </SupabaseProvider>
);
