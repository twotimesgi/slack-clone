import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
export default defineSchema({
    ...authTables,
    workspaces: defineTable({
        name: v.string(),
        userId: v.id("users"),
        joinCode: v.string(),
    }),
    members: defineTable({
        workspaceId: v.id("workspaces"),
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("member")),
    }).index("by_user_id", ["userId"]).index("by_workspace_id", ["workspaceId"]).index("by_workspace_id_and_user_id", ["workspaceId", "userId"]),
});

