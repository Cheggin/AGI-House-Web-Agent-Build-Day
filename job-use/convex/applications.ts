import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createApplication = mutation({
  args: {
    candidateId: v.id("candidates"),
    jobId: v.id("jobs"),
    coverLetter: v.optional(v.string()),
  },
  returns: v.id("applications"),
  handler: async (ctx, args) => {
    const existingApplication = await ctx.db
      .query("applications")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .first();

    if (existingApplication) {
      throw new Error("You have already applied for this job");
    }

    return await ctx.db.insert("applications", {
      ...args,
      appliedDate: new Date().toISOString(),
      status: "pending",
    });
  },
});

export const listApplications = query({
  args: {
    candidateId: v.optional(v.id("candidates")),
    jobId: v.optional(v.id("jobs")),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("accepted"),
      v.literal("rejected")
    )),
  },
  returns: v.array(
    v.object({
      _id: v.id("applications"),
      _creationTime: v.number(),
      candidateId: v.id("candidates"),
      jobId: v.id("jobs"),
      appliedDate: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("reviewed"),
        v.literal("accepted"),
        v.literal("rejected")
      ),
      coverLetter: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    let query;

    if (args.candidateId) {
      query = ctx.db.query("applications").withIndex("by_candidate", (q) =>
        q.eq("candidateId", args.candidateId!)
      );
    } else if (args.jobId) {
      query = ctx.db.query("applications").withIndex("by_job", (q) =>
        q.eq("jobId", args.jobId!)
      );
    } else if (args.status) {
      query = ctx.db.query("applications").withIndex("by_status", (q) =>
        q.eq("status", args.status!)
      );
    } else {
      query = ctx.db.query("applications");
    }

    const results = await query.collect();

    if (args.candidateId && args.jobId) {
      return results.filter(app => app.jobId === args.jobId);
    }
    if (args.candidateId && args.status) {
      return results.filter(app => app.status === args.status);
    }
    if (args.jobId && args.status) {
      return results.filter(app => app.status === args.status);
    }

    return results;
  },
});

export const getApplicationWithDetails = query({
  args: { applicationId: v.id("applications") },
  returns: v.union(
    v.null(),
    v.object({
      application: v.object({
        _id: v.id("applications"),
        _creationTime: v.number(),
        candidateId: v.id("candidates"),
        jobId: v.id("jobs"),
        appliedDate: v.string(),
        status: v.union(
          v.literal("pending"),
          v.literal("reviewed"),
          v.literal("accepted"),
          v.literal("rejected")
        ),
        coverLetter: v.optional(v.string()),
      }),
      job: v.object({
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
      }),
      candidate: v.object({
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
    })
  ),
  handler: async (ctx, args) => {
    const application = await ctx.db.get(args.applicationId);
    if (!application) return null;

    const job = await ctx.db.get(application.jobId);
    const candidate = await ctx.db.get(application.candidateId);

    if (!job || !candidate) return null;

    return {
      application,
      job,
      candidate,
    };
  },
});

export const updateApplicationStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});