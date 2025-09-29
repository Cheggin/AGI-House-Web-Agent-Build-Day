import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  candidates: defineTable({
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
  }).index("by_email", ["email"]),

  jobExperiences: defineTable({
    candidateId: v.id("candidates"),
    company: v.string(),
    title: v.string(),
    currentJob: v.boolean(),
    startDate: v.string(),
    endDate: v.string(),
    scope: v.string(),
  }).index("by_candidate", ["candidateId"]),

  questions: defineTable({
    candidateId: v.id("candidates"),
    questionId: v.string(),
    name: v.string(),
    answer: v.string(),
    intent: v.string(),
    answered: v.boolean(),
    questionType: v.string(),
    options: v.optional(v.array(v.string())),
  }).index("by_candidate", ["candidateId"]),

  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    location: v.string(),
    salary: v.string(),
    description: v.string(),
    requirements: v.array(v.string()),
    postedDate: v.string(),
    status: v.union(v.literal("active"), v.literal("closed")),
  }).index("by_status", ["status"]),

  applications: defineTable({
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
    .index("by_candidate", ["candidateId"])
    .index("by_job", ["jobId"])
    .index("by_status", ["status"]),
});
