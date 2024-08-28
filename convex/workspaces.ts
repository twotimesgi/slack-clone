import { mutation, query } from "./_generated/server";
import {v} from "convex/values";
import {auth} from "./auth";
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("workspaces").collect();
    },
})

export const create = mutation({
    args: {
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }
        const joinCode = "123456"
        const workdspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            userId,
            joinCode
        });

        await ctx.db.insert("members", {
            workspaceId: workdspaceId,
            userId,
            role: "admin"
        });
        
        return workdspaceId;
    }
});

export const getById = query({
    args: {
        id: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }

        return await ctx.db.get(args.id);
    }
});