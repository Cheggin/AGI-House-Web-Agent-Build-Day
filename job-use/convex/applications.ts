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

    // Generate detailed agent trace data
    const agentSummary = `📄  Final Result:
Successfully completed job application form with the following actions:
- Filled 7 text input fields (First Name, Last Name, Email, Phone, Postal Code, City, Today's Date)
- Uploaded resume document (test_CV.pdf) and verified upload
- Selected 10 radio button options (Age 18+, Eligible to work, Visa sponsorship, Professional license, Hispanic/Latino, Disability, plus 4 in disability disclosure list)
- Completed 5 dropdown selections (State, Years of Experience, Gender, Race/Ethnicity, Veteran Status)
- Answered 1 text area question (profile summary)
- Total fields completed: 23
- Form submitted: Yes ("Thank you for submitting" confirmation displayed)`;

    const questionsDetected = [
      { question: "Legal First Name", answer: "Linda", fieldType: "text" },
      { question: "Legal Last Name", answer: "Harris", fieldType: "text" },
      { question: "Email", answer: "linda.har494f4@gmail.com", fieldType: "email" },
      { question: "Phone", answer: "12312312345", fieldType: "tel" },
      { question: "Upload Resume", answer: "test_CV.pdf", fieldType: "file" },
      { question: "Postal Code (ZIP)", answer: "06238", fieldType: "text" },
      { question: "Country", answer: "United States", fieldType: "dropdown" },
      { question: "State", answer: "Connecticut", fieldType: "dropdown" },
      { question: "City", answer: "Coventry", fieldType: "text" },
      { question: "Over age 18?", answer: "Yes", fieldType: "radio" },
      { question: "Eligible to work in US?", answer: "Yes", fieldType: "radio" },
      { question: "Require visa sponsorship?", answer: "No", fieldType: "radio" },
      { question: "Professional license?", answer: "No", fieldType: "radio" },
      { question: "What drew you to healthcare?", answer: "I have always been passionate about making a difference in people's lives...", fieldType: "textarea" },
      { question: "Years of experience in related role", answer: "1-2 years", fieldType: "dropdown" },
      { question: "Gender Identification", answer: "Female", fieldType: "dropdown" },
      { question: "Race/Ethnicity", answer: "Black or African American (Not Hispanic or Latino)", fieldType: "dropdown" },
      { question: "Identify as Hispanic/Latino?", answer: "No", fieldType: "radio" },
      { question: "Veteran Status", answer: "I AM NOT A VETERAN", fieldType: "dropdown" },
      { question: "Disability Status", answer: "No, I do not have a disability", fieldType: "radio" },
      { question: "Today's Date", answer: "09/27/2025", fieldType: "text" }
    ];

    const agentTraces = [
      {
        timestamp: new Date().toISOString(),
        action: "NAVIGATE",
        element: "application_form",
        value: "Navigating to job application page",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 1000).toISOString(),
        action: "FILL",
        element: "input[name='firstName']",
        value: "Linda",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 2000).toISOString(),
        action: "FILL",
        element: "input[name='lastName']",
        value: "Harris",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 3000).toISOString(),
        action: "FILL",
        element: "input[name='email']",
        value: "linda.har494f4@gmail.com",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 4000).toISOString(),
        action: "FILL",
        element: "input[name='phone']",
        value: "12312312345",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 5000).toISOString(),
        action: "FILL",
        element: "input[name='postalCode']",
        value: "06238",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 6000).toISOString(),
        action: "SELECT",
        element: "select[name='state']",
        value: "Connecticut",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 7000).toISOString(),
        action: "FILL",
        element: "input[name='city']",
        value: "Coventry",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 8000).toISOString(),
        action: "SELECT",
        element: "radio[name='over18']",
        value: "Yes",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 9000).toISOString(),
        action: "SELECT",
        element: "radio[name='eligibleToWork']",
        value: "Yes",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 10000).toISOString(),
        action: "SELECT",
        element: "radio[name='visaSponsorship']",
        value: "No",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 11000).toISOString(),
        action: "GENERATE",
        element: "textarea[name='healthcareMotivation']",
        value: "Generated response based on profile",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 12000).toISOString(),
        action: "SELECT",
        element: "select[name='yearsExperience']",
        value: "1-2 years",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 13000).toISOString(),
        action: "SELECT",
        element: "select[name='gender']",
        value: "Female",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 14000).toISOString(),
        action: "SELECT",
        element: "select[name='race']",
        value: "Black or African American",
        success: true
      },
      {
        timestamp: new Date(Date.now() + 15000).toISOString(),
        action: "SUBMIT",
        element: "button[type='submit']",
        value: "Application submitted successfully",
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