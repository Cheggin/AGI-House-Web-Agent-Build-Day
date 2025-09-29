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

    // Generate mock agent trace data
    const agentSummary = "Successfully automated application submission. Detected 8 form fields, filled personal information from profile, identified 3 custom questions, generated tailored responses based on job requirements. All fields validated and submitted successfully.";

    const questionsDetected = [
      {
        question: "Why are you interested in this position?",
        answer: "Based on my experience and the job requirements, I believe this role aligns perfectly with my career goals and expertise.",
        fieldType: "textarea"
      },
      {
        question: "What is your expected salary range?",
        answer: "Based on market research and my experience level",
        fieldType: "select"
      },
      {
        question: "Are you authorized to work in this location?",
        answer: "Yes",
        fieldType: "radio"
      }
    ];

    const agentTraces = [
      {
        timestamp: new Date().toISOString(),
        action: "NAVIGATE",
        element: "application_form",
        value: "https://careers.company.com/apply",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 1000).toISOString(),
        action: "FILL",
        element: "input#firstName",
        value: "Profile data extracted",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 2000).toISOString(),
        action: "FILL",
        element: "input#lastName",
        value: "Profile data extracted",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 3000).toISOString(),
        action: "SELECT",
        element: "select#experience",
        value: "5-10 years",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 4000).toISOString(),
        action: "GENERATE",
        element: "textarea#coverLetter",
        value: "AI-generated cover letter based on job description",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 5000).toISOString(),
        action: "SUBMIT",
        element: "button#submit",
        value: "Application submitted",
        success: true
      }
    ];

    return await ctx.db.insert("applications", {
      ...args,
      appliedDate: new Date().toISOString(),
      status: "pending",
      agentSummary,
      questionsDetected,
      agentTraces,
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
      agentSummary: v.optional(v.string()),
      questionsDetected: v.optional(v.array(v.object({
        question: v.string(),
        answer: v.string(),
        fieldType: v.string(),
      }))),
      agentTraces: v.optional(v.array(v.object({
        timestamp: v.string(),
        action: v.string(),
        element: v.string(),
        value: v.optional(v.string()),
        success: v.boolean(),
      }))),
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

export const clearAllApplications = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const applications = await ctx.db.query("applications").collect();
    for (const app of applications) {
      await ctx.db.delete(app._id);
    }
    return applications.length;
  },
});