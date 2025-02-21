import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import getServerSession from "next-auth";
import authOptions from "@/auth";


const handler = async (req: Request) => {
    const session = getServerSession(authOptions);

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ session }),
  });
};

export { handler as GET, handler as POST };
