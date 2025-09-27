import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCandidate = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    profileType: v.string(),
    cvUploaded: v.boolean(),
    firstName: v.string(),
    lastName: v.string(),
    eligibilityToWork: v.boolean(),
    age: v.number(),
    postCode: v.string(),
    birthdate: v.string(),
    phone: v.string(),
    country: v.string(),
    county: v.string(),
    salary: v.string(),
    profileSummary: v.string(),
    currentJobTitle: v.string(),
    currentCompany: v.string(),
    experience: v.number(),
  },
  returns: v.id("candidates"),
  handler: async (ctx, args) => {
    const candidateId = await ctx.db.insert("candidates", args);
    return candidateId;
  },
});

export const getCandidate = query({
  args: { id: v.id("candidates") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("candidates"),
      _creationTime: v.number(),
      email: v.string(),
      password: v.string(),
      profileType: v.string(),
      cvUploaded: v.boolean(),
      firstName: v.string(),
      lastName: v.string(),
      eligibilityToWork: v.boolean(),
      age: v.number(),
      postCode: v.string(),
      birthdate: v.string(),
      phone: v.string(),
      country: v.string(),
      county: v.string(),
      salary: v.string(),
      profileSummary: v.string(),
      currentJobTitle: v.string(),
      currentCompany: v.string(),
      experience: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getCandidateByEmail = query({
  args: { email: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("candidates"),
      _creationTime: v.number(),
      email: v.string(),
      password: v.string(),
      profileType: v.string(),
      cvUploaded: v.boolean(),
      firstName: v.string(),
      lastName: v.string(),
      eligibilityToWork: v.boolean(),
      age: v.number(),
      postCode: v.string(),
      birthdate: v.string(),
      phone: v.string(),
      country: v.string(),
      county: v.string(),
      salary: v.string(),
      profileSummary: v.string(),
      currentJobTitle: v.string(),
      currentCompany: v.string(),
      experience: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const updateCandidate = mutation({
  args: {
    id: v.id("candidates"),
    email: v.optional(v.string()),
    profileType: v.optional(v.string()),
    cvUploaded: v.optional(v.boolean()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    eligibilityToWork: v.optional(v.boolean()),
    age: v.optional(v.number()),
    postCode: v.optional(v.string()),
    birthdate: v.optional(v.string()),
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    county: v.optional(v.string()),
    salary: v.optional(v.string()),
    profileSummary: v.optional(v.string()),
    currentJobTitle: v.optional(v.string()),
    currentCompany: v.optional(v.string()),
    experience: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const upsertCandidate = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    profileType: v.string(),
    cvUploaded: v.boolean(),
    firstName: v.string(),
    lastName: v.string(),
    eligibilityToWork: v.boolean(),
    age: v.number(),
    postCode: v.string(),
    birthdate: v.string(),
    phone: v.string(),
    country: v.string(),
    county: v.string(),
    salary: v.string(),
    profileSummary: v.string(),
    currentJobTitle: v.string(),
    currentCompany: v.string(),
    experience: v.number(),
  },
  returns: v.id("candidates"),
  handler: async (ctx, args) => {
    // Check if candidate exists
    const existingCandidate = await ctx.db
      .query("candidates")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingCandidate) {
      // Update existing candidate
      await ctx.db.patch(existingCandidate._id, args);
      return existingCandidate._id;
    } else {
      // Create new candidate
      const candidateId = await ctx.db.insert("candidates", args);
      return candidateId;
    }
  },
});