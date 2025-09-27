import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createJobExperience = mutation({
  args: {
    candidateId: v.id("candidates"),
    company: v.string(),
    title: v.string(),
    currentJob: v.boolean(),
    startDate: v.string(),
    endDate: v.string(),
    scope: v.string(),
  },
  returns: v.id("jobExperiences"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobExperiences", args);
  },
});

export const getJobExperiencesByCandidate = query({
  args: { candidateId: v.id("candidates") },
  returns: v.array(
    v.object({
      _id: v.id("jobExperiences"),
      _creationTime: v.number(),
      candidateId: v.id("candidates"),
      company: v.string(),
      title: v.string(),
      currentJob: v.boolean(),
      startDate: v.string(),
      endDate: v.string(),
      scope: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobExperiences")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();
  },
});

export const createBulkJobExperiences = mutation({
  args: {
    candidateId: v.id("candidates"),
    experiences: v.array(
      v.object({
        company: v.string(),
        title: v.string(),
        currentJob: v.boolean(),
        startDate: v.string(),
        endDate: v.string(),
        scope: v.string(),
      })
    ),
  },
  returns: v.array(v.id("jobExperiences")),
  handler: async (ctx, args) => {
    const ids = [];
    for (const experience of args.experiences) {
      const id = await ctx.db.insert("jobExperiences", {
        candidateId: args.candidateId,
        ...experience,
      });
      ids.push(id);
    }
    return ids;
  },
});