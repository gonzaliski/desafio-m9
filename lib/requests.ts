import type { NextApiRequest, NextApiResponse } from "next";

export function getOffsetAndLimit(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 1000
) {
  const queryLimit = parseInt((req.query.limit as string) || "0");
  const queryOffset = parseInt((req.query.offset as string) || "0");
  const limit = queryLimit
    ? queryLimit <= maxLimit
      ? queryLimit
      : maxLimit
    : 10;
  const offset = queryOffset < maxOffset ? queryOffset : 0;
  return {
    limit,
    offset,
  };
}
