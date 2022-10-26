import { router, publicProcedure } from "../trpc";
import { z } from "zod";

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
          id: input.id
        }
      });
    }),
  deleteSnippet: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.snippet.delete({
        where: {
          id: input.id
        }
      });
    }),
  updateSnippet: publicProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.snippet.update({
        where: {
          id: input.id
        },
        data: {
          text: input.text
        }
      });
    }
  )
});
