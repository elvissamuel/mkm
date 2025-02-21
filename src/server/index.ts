import { publicProcedure, router } from "./trpc";
import { authRouter } from "./modules/auth";
import { userRouter } from "./modules/user";
import { adminRouter } from "./modules/admin";
import { createTestimony } from "./modules/testimony";


export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
  createTestimony,
  healthCheck: publicProcedure.query(() => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
