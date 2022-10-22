// src/server/router/_app.ts
import { router } from "../trpc";
import { snippetRouter } from "./snippet";

export const appRouter = router({
  snippet: snippetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
