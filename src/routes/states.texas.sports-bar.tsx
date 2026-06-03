import { createFileRoute } from "@tanstack/react-router";
import { BigTexSportsBarRoom } from "@/components/BigTexSportsBarRoom";

export const Route = createFileRoute("/states/texas/sports-bar")({
  head: () => ({
    meta: [
      { title: "Big Tex Sports Bar — Texas · National Chat" },
      { name: "description", content: "Rivalries. Live games. Hot takes. Step into the loudest sports bar in Texas." },
    ],
  }),
  component: BigTexSportsBarRoom,
});
