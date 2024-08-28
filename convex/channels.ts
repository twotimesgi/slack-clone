import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";
import { mutation } from "./_generated/server";
export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return [];
        }

        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if (!member) {
            return [];
        }

        const channels = await ctx.db.query("channels").withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId)).collect();
        return channels;
    },
})

export const create = mutation({
    args: {
        name: v.string(),
        workspaceId: v.id("workspaces"),
    }, 
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }


        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized");
        }

        const parsedName = args.name.replaceAll(" ", "-").toLowerCase()

        
        const channelId = await ctx.db.insert("channels", {
            workspaceId: args.workspaceId,
            name: args.name,
        });

        return channelId;

    },
})