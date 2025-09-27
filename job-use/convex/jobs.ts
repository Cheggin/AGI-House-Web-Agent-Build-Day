import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createJob = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    postedDate: v.string(),
    status: v.union(v.literal("active"), v.literal("closed")),
  },
  returns: v.id("jobs"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", args);
  },
});

export const listJobs = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("closed")))
  },
  returns: v.array(
    v.object({
      _id: v.id("jobs"),
      _creationTime: v.number(),
      title: v.string(),
      company: v.string(),
      location: v.string(),
      salary: v.string(),
      description: v.string(),
      requirements: v.array(v.string()),
      postedDate: v.string(),
      status: v.union(v.literal("active"), v.literal("closed")),
    })
  ),
  handler: async (ctx, args) => {
    if (args.status !== undefined) {
      return await ctx.db
        .query("jobs")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("jobs").collect();
  },
});

export const getJob = query({
  args: { id: v.id("jobs") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("jobs"),
      _creationTime: v.number(),
      title: v.string(),
      company: v.string(),
      location: v.string(),
      salary: v.string(),
      description: v.string(),
      requirements: v.array(v.string()),
      postedDate: v.string(),
      status: v.union(v.literal("active"), v.literal("closed")),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateJobStatus = mutation({
  args: {
    id: v.id("jobs"),
    status: v.union(v.literal("active"), v.literal("closed")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const seedJobs = mutation({
  args: {},
  returns: v.array(v.id("jobs")),
  handler: async (ctx) => {
    const existingJobs = await ctx.db.query("jobs").collect();
    if (existingJobs.length > 0) {
      return existingJobs.map(job => job._id);
    }

    const jobs = [
      {
        title: "Senior Software Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        salary: "$150,000 - $200,000",
        description: "We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies. The ideal candidate has strong experience with React, Node.js, and cloud platforms.",
        requirements: [
          "5+ years of professional software development experience",
          "Strong proficiency in JavaScript/TypeScript",
          "Experience with React, Node.js, and modern web frameworks",
          "Familiarity with cloud platforms (AWS, GCP, or Azure)",
          "Excellent problem-solving and communication skills",
          "Bachelor's degree in Computer Science or related field"
        ],
        postedDate: new Date().toISOString(),
        status: "active" as const,
      },
      {
        title: "Product Manager",
        company: "StartupXYZ",
        location: "New York, NY",
        salary: "$120,000 - $160,000",
        description: "StartupXYZ is seeking an experienced Product Manager to lead product strategy and development. You will work closely with engineering, design, and business teams to deliver innovative solutions that meet customer needs and drive business growth.",
        requirements: [
          "3+ years of product management experience",
          "Strong analytical and strategic thinking skills",
          "Experience with agile development methodologies",
          "Excellent communication and leadership abilities",
          "Data-driven decision-making approach",
          "MBA or equivalent experience preferred"
        ],
        postedDate: new Date().toISOString(),
        status: "active" as const,
      }
    ];

    const ids = [];
    for (const job of jobs) {
      const id = await ctx.db.insert("jobs", job);
      ids.push(id);
    }
    return ids;
  },
});