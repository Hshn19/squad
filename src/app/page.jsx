// src/app/page.jsx
// Redirect root to dashboard

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}