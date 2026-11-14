import { redirect } from "next/navigation";

// No dashboard yet — send visitors to the first page being rebuilt
export default function HomePage() {
  redirect("/promotion/mini-game-v2");
}
