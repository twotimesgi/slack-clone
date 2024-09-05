import { v } from "convex/values";
import {query, QueryCtx, mutation} from "./_generated/server";
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

export const getById = query({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if(!userId) {
            return null;
        }

        const member = await ctx.db.get(args.id);
        if(!member) {
            return null;
        }

        const currentMember = 
        await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", member.workspaceId).eq("userId", userId)).unique();

        if(!currentMember) {
            return null;
        }

        const user = await populateUser(ctx, member.userId);
        if(!user) {
            return null;
        }

        return {
            ...member,
            user,
        }
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

export const update = mutation({
    args: {
        id: v.id("members"),
        role: v.union(v.literal("admin"), v.literal("member")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
            throw new Error("Not authenticated");
        }
        const member = await ctx.db.get(args.id);
        if(!member) {
            throw new Error("Member not found");
        }
        const currentMember = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", member.workspaceId).eq("userId", userId)).unique();

        if(!currentMember || currentMember.role !== "admin") {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.id, {
            role: args.role,
        });

        return args.id;
    }
});

export const remove = mutation({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
            throw new Error("Not authenticated");
        }
        const member = await ctx.db.get(args.id);
        if(!member) {
            throw new Error("Member not found");
        }
        const currentMember = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", member.workspaceId).eq("userId", userId)).unique();

        if(!currentMember) {
            throw new Error("Not authorized");
        }

        if(member.role === "admin") {
            throw new Error("Cannot remove the admin");
        }

        if(currentMember._id === args.id && currentMember.role === "admin") {
            throw new Error("Cannot remove yourself");
        }

        const [messages, reactions, conversations] = await Promise.all([
            ctx.db.query("messages").withIndex("by_member_id", (q) => q.eq("memberId", member._id)).collect(),
            ctx.db.query("reactions").withIndex("by_member_id", (q) => q.eq("memberId", member._id)).collect(),
            ctx.db.query("conversations").filter((q) => q.or(
                q.eq(q.field("memberOneId"), member._id),
                q.eq(q.field("memberTwoId"), member._id)
            )).collect()
            ]);

        for(const message of messages){
           await ctx.db.delete(message._id);
        }

        for(const reaction of reactions){
            await ctx.db.delete(reaction._id)
        }

        for(const conversation of conversations){
            await ctx.db.delete(conversation._id)
        }

        await ctx.db.delete(args.id);
        return args.id;

    }
});