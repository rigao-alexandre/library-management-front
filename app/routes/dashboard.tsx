import { BaseLayout } from "@/components/layout/base-layout";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Dashboard" },
  ];
}

export default function Home() {
  return <BaseLayout>Dashboard</BaseLayout>;
}
