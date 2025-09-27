import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createQuestion = mutation({
  args: {
    candidateId: v.id("candidates"),
    questionId: v.string(),
    name: v.string(),
    answer: v.string(),
    intent: v.string(),
    answered: v.boolean(),
    questionType: v.string(),
    options: v.optional(v.array(v.string())),
  },
  returns: v.id("questions"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", args);
  },
});

export const getQuestionsByCandidate = query({
  args: { candidateId: v.id("candidates") },
  returns: v.array(
    v.object({
      _id: v.id("questions"),
      _creationTime: v.number(),
      candidateId: v.id("candidates"),
      questionId: v.string(),
      name: v.string(),
      answer: v.string(),
      intent: v.string(),
      answered: v.boolean(),
      questionType: v.string(),
      options: v.optional(v.array(v.string())),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();
  },
});

export const createBulkQuestions = mutation({
  args: {
    candidateId: v.id("candidates"),
    questions: v.array(
      v.object({
        questionId: v.string(),
        name: v.string(),
        answer: v.string(),
        intent: v.string(),
        answered: v.boolean(),
        questionType: v.string(),
        options: v.optional(v.array(v.string())),
      })
    ),
  },
  returns: v.array(v.id("questions")),
  handler: async (ctx, args) => {
    const ids = [];
    for (const question of args.questions) {
      const id = await ctx.db.insert("questions", {
        candidateId: args.candidateId,
        ...question,
      });
      ids.push(id);
    }
    return ids;
  },
});

export const replaceQuestions = mutation({
  args: {
    candidateId: v.id("candidates"),
    questions: v.array(
      v.object({
        questionId: v.string(),
        name: v.string(),
        answer: v.string(),
        intent: v.string(),
        answered: v.boolean(),
        questionType: v.string(),
        options: v.optional(v.array(v.string())),
      })
    ),
  },
  returns: v.array(v.id("questions")),
  handler: async (ctx, args) => {
    // Delete existing questions for this candidate
    const existingQuestions = await ctx.db
      .query("questions")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    for (const question of existingQuestions) {
      await ctx.db.delete(question._id);
    }

    // Insert new questions
    const ids = [];
    for (const question of args.questions) {
      const id = await ctx.db.insert("questions", {
        candidateId: args.candidateId,
        ...question,
      });
      ids.push(id);
    }
    return ids;
  },
});