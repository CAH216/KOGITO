import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogLevel, logSystemEvent } from "./logger";

/**
 * Higher-order function to wrap server actions with automatic logging and error handling.
 * 
 * @param actionName - A unique string identifier for the action (e.g., 'UPDATE_PROFILE')
 * @param fn - The server action function to execute
 * @returns A wrapped function that logs success/error
 */
export const withLogging = <T, R>(
  actionName: string,
  fn: (data: T) => Promise<R>
) => {
  return async (data: T): Promise<R> => {
    // 1. Get current user logic (if possible in this context)
    // Note: getServerSession is slow, so only fetch if critical or optimize later.
    let  userEmail = "anonymous";
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            userEmail = session.user.email;
        }
    } catch { 
        // Ignore session verify errors in wrapper to avoid blocking action
    }

    try {
        // 2. Execute Action
        const result = await fn(data);

        // 3. Log Success
        // We log asynchronously so we don't block the UI response time too much (though Node is single threaded, await ensures completion)
        // For critical actions, we await. For logs, we can choose.
        await logSystemEvent(
            actionName, 
            `Action executed successfully by ${userEmail}`, 
            LogLevel.INFO,
            { user: userEmail, args: typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : data }
        );

        return result;

    } catch (error: any) {
        // 4. Log Error
        await logSystemEvent(
            `${actionName}_ERROR`,
            `Failed to execute action by ${userEmail}`,
            LogLevel.ERROR,
            { error: error.message, stack: error.stack }
        );
        throw error; // Re-throw so the UI knows it failed
    }
  };
};
