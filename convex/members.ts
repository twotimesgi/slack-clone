import { v } from "convex/values";
import {query, QueryCtx} from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";

const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
    return ctx.db.get(id);
}

export const get = query({
    args: { workspaceId: v.id("workspaces")},
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
            return [];
        }
        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if(!member ) {
            return [];
        }

        const membersData = await ctx.db.query("members").withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId)).collect();
        const members = [];

        for(const member of membersData){
            const user : Doc<"users"> | null = await populateUser(ctx, member.userId);
            if(user) {
                members.push({
                    ...member,
                    user,
                })
            }
        }
        return members;
    }
})


export const current = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
            return null;
        }
        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if(!member ) {
            return null;
        }
        return member;
    }
});