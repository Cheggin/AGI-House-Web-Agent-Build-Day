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
        title: "LPN Staff I - Long Term Care",
        company: "Rochester Regional Health",
        location: "Newark, NY 14513",
        salary: "Up to $15,000 Sign-On Bonus",
        description: "Job Title: LPN Staff I – Long Term Care\nDepartment: Rehab\nLocation: DeMay Living Center\nHours Per Week: 24\nSchedule: Evenings, 2p-10p\n\nRochester Regional Health is seeking a dedicated LPN Staff I to join our Long Term Care facility. This position offers evening shifts with a competitive sign-on bonus. You'll be part of a team committed to providing exceptional care to our residents in a supportive environment.",
        requirements: [
          "Current LPN license in New York State",
          "CPR/BLS certification required",
          "Experience in long-term care or rehabilitation preferred",
          "Ability to work evening shifts (2pm-10pm)",
          "Strong communication and interpersonal skills",
          "Commitment to providing compassionate patient care"
        ],
        postedDate: new Date().toISOString(),
        status: "active" as const,
      },
      {
        title: "Assistant Manager",
        company: "Hollister Co.",
        location: "Santa Anita, Arcadia, CA",
        salary: "$25.00 per hour",
        description: "The Assistant Manager is a multi-faceted role that merges business strategy, operations, creativity, and people management. Strategically, assistant managers are responsible for driving sales results by analyzing the business and providing best-in-class customer service. They are responsible for overseeing daily store operations including opening and closing routines and driving efficiency in all store processes.\n\nAssistant managers leverage their creative expertise through floorset updates, styling recommendations and product knowledge. They are also talent leaders, driving everything from recruiting and training to engagement and development. With a promote from within philosophy, our Assistant managers will build upon their initial foundation and have the opportunity to grow into future leaders.",
        requirements: [
          "Bachelor's degree OR one year of supervisory experience in a customer-facing role",
          "Strong problem-solving skills",
          "Ability to thrive in a fast-paced environment",
          "Team building and leadership skills",
          "Strong interpersonal and communication skills",
          "Fashion interest and knowledge",
          "Multi-tasking abilities",
          "Drive to achieve results"
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

export const clearAndReseedJobs = mutation({
  args: {},
  returns: v.array(v.id("jobs")),
  handler: async (ctx) => {
    // Delete all existing jobs
    const existingJobs = await ctx.db.query("jobs").collect();
    for (const job of existingJobs) {
      await ctx.db.delete(job._id);
    }

    // Add new jobs
    const jobs = [
      {
        title: "LPN Staff I - Long Term Care",
        company: "Rochester Regional Health",
        location: "Newark, NY 14513",
        salary: "Up to $15,000 Sign-On Bonus",
        description: "Job Title: LPN Staff I – Long Term Care\nDepartment: Rehab\nLocation: DeMay Living Center\nHours Per Week: 24\nSchedule: Evenings, 2p-10p\n\nRochester Regional Health is seeking a dedicated LPN Staff I to join our Long Term Care facility. This position offers evening shifts with a competitive sign-on bonus. You'll be part of a team committed to providing exceptional care to our residents in a supportive environment.",
        requirements: [
          "Current LPN license in New York State",
          "CPR/BLS certification required",
          "Experience in long-term care or rehabilitation preferred",
          "Ability to work evening shifts (2pm-10pm)",
          "Strong communication and interpersonal skills",
          "Commitment to providing compassionate patient care"
        ],
        postedDate: new Date().toISOString(),
        status: "active" as const,
      },
      {
        title: "Assistant Manager",
        company: "Hollister Co.",
        location: "Santa Anita, Arcadia, CA",
        salary: "$25.00 per hour",
        description: "The Assistant Manager is a multi-faceted role that merges business strategy, operations, creativity, and people management. Strategically, assistant managers are responsible for driving sales results by analyzing the business and providing best-in-class customer service. They are responsible for overseeing daily store operations including opening and closing routines and driving efficiency in all store processes.\n\nAssistant managers leverage their creative expertise through floorset updates, styling recommendations and product knowledge. They are also talent leaders, driving everything from recruiting and training to engagement and development. With a promote from within philosophy, our Assistant managers will build upon their initial foundation and have the opportunity to grow into future leaders.",
        requirements: [
          "Bachelor's degree OR one year of supervisory experience in a customer-facing role",
          "Strong problem-solving skills",
          "Ability to thrive in a fast-paced environment",
          "Team building and leadership skills",
          "Strong interpersonal and communication skills",
          "Fashion interest and knowledge",
          "Multi-tasking abilities",
          "Drive to achieve results"
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