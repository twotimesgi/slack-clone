import { mutation, query } from "./_generated/server";
import {v} from "convex/values";
import {auth} from "./auth";

const generateCode = () => {
    const code = Array.from({length: 6}, () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]).join("");
    return code;
}
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
         return [];
        }

    

        const members = await ctx.db.query("members").withIndex("by_user_id", (q) => q.eq("userId", userId)).collect();
        const workspaceIds = members.map((m) => m.workspaceId);
        const workspaces = [];
        for(const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);
            if(workspace){
            workspaces.push(workspace);
            }
        }
        return workspaces;
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
        const joinCode = generateCode();
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

        await ctx.db.insert("channels", {
            workspaceId: workdspaceId,
            name: "general"
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

        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id" , (q) => q.eq("workspaceId", args.id ).eq("userId", userId)).unique();
        if(!member){
            return null;
        }
        return await ctx.db.get(args.id);
    }
});

export const update = mutation({
    args: {
        id: v.id("workspaces"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }

        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id" , (q) => q.eq("workspaceId", args.id ).eq("userId", userId)).unique();
        if(!member){
            throw new Error("Not a member of this workspace");
        }else if(member.role !== "admin"){
            throw new Error("Only admins can update workspace");
        }

        await ctx.db.patch(args.id, {name: args.name});
        return args.id;
    }
});

export const remove = mutation({
    args: {
        id: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }

        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id" , (q) => q.eq("workspaceId", args.id ).eq("userId", userId)).unique();
        if(!member){
            throw new Error("Not a member of this workspace");
        }else if(member.role !== "admin"){
            throw new Error("Only admins can delete workspace");
        }


        const [members] = await Promise.all([
            ctx.db.query("members").withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id)).collect(),
        ]);

        for(const member of members) {
            await ctx.db.delete(member._id);
        }
        await ctx.db.delete(args.id);
        return args.id;
        },
});

export const resetCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }

        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id" , (q) => q.eq("workspaceId", args.workspaceId ).eq("userId", userId)).unique();
        if(!member){
            throw new Error("Not a member of this workspace");
        }else if(member.role !== "admin"){
            throw new Error("Only admins can update workspace");
        }

        const joinCode = generateCode();
        await ctx.db.patch(args.workspaceId, {joinCode});
        return args.workspaceId;
    }
});

export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }

        const workspace = await ctx.db.get(args.workspaceId);
        if(!workspace){
            throw new Error("Workspace not found");
        }

        if(workspace.joinCode !== args.joinCode.toLowerCase()){
            throw new Error("Invalid join code");
        }

        const existingMember = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();
        if(existingMember){
            throw new Error("Already a member of this workspace");
        }

        await ctx.db.insert("members", {
            workspaceId: args.workspaceId,
            userId,
            role: "member"
        });

        return args.workspaceId;
    }
});

export const getInfoById = query({
    args: {
        workspaceId: v.id("workspaces")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if(!userId) {
           throw new Error("Not authenticated");
        }
        
        const workspace = await ctx.db.get(args.workspaceId);
        if(!workspace){
            throw new Error("Workspace not found");
        }

        const member = await ctx.db.query("members").withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId)).unique();

        return {name: workspace?.name, isMember: !!member};
    }
});