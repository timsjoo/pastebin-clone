// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const snippets = async (req: NextApiRequest, res: NextApiResponse) => {
  const snippets = await prisma.snippet.findMany();
  res.status(200).json(snippets);
};

export default snippets;



// next js
// https://www.domain/api/snippets
// AWS Lambda (short lived amazon server)
// this endpoint

// express
// router, controller method

// trpc
// function, router, (controller method)

// prisma (ORM) [like objection]
// data model, facilitate SQL execution [sends it to the DB]



