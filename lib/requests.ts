export function getOffsetAndLimit(
  limitFromReq,
  offsetFromReq,
  maxLimit = 100,
  maxOffset = 1000
) {
  const queryLimit = parseInt(limitFromReq || "0");
  const queryOffset = parseInt(offsetFromReq || "0");
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
