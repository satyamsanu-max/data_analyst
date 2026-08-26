/**
 * Constants shared between the edge middleware and the Node-only auth module.
 * Kept separate because middleware cannot import anything that pulls in Prisma.
 */
export const SESSION_COOKIE = "ip_session";
