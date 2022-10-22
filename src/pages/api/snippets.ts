// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const snippets = async (req: NextApiRequest, res: NextApiResponse) => {
  const snippets = await prisma.snippet.findMany();
  res.status(200).json(snippets);
};

export default snippets;
