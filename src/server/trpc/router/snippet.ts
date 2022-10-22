import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { Input } from "postcss";

export const snippetRouter = router({
  saveSnippet: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      const snippet = ctx.prisma.snippet.create({
        data: {
          text: input?.text,
        }
      })
      return snippet;
    }),
  getAllSnippets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.snippet.findMany();
  }),
  getOneSnippet: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.snippet.findUnique({
        where: {
          id: input?.id
        }
      });
    }),
});
