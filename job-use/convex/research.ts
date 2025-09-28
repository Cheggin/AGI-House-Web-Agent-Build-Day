import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDeepResearch = query({
  args: {
    jobId: v.id("jobs"),
  },
  returns: v.object({
    Summary: v.string(),
    Recommendation: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get the job details to determine which research data to return
    const job = await ctx.db.get(args.jobId);

    if (!job) {
      return {
        Summary: "Job not found.",
        Recommendation: "Unable to provide research for this position."
      };
    }

    // Return mock research data based on the company
    if (job.company.includes("Rochester")) {
      // Rochester Regional Health research data
      return {
        Summary: "Rochester Regional Health is a comprehensive healthcare organization serving the Greater Rochester Region and surrounding areas. It offers a wide range of services including Same-Day Walk-In Care (Urgent Care, Virtual Urgent Care, Orthopedic Urgent Care, Emergency Care), Specialty Care (Bariatric Surgery, Behavioral Health, Cardiology, Neurology & Neurosurgery, Oncology, Orthopedics, Imaging & Radiology, Labs, Primary Care, Pediatrics, Senior Care, Women's Health), Outpatient Locations (Health and Medical Campuses, Urgent Care Centers, Primary Care Centers, Emergency Centers, Imaging Centers, Labs), and Hospitals and Emergency Rooms (Rochester General Hospital, Unity Hospital, Newark-Wayne Community Hospital, Canton-Potsdam Hospital, Gouverneur Hospital, Clifton Springs Hospitals & Clinic, United Memorial Medical Center, Massena Hospital, Unity Specialty Hospital). The organization provides patient-centered care with easy appointment scheduling and same-day virtual care options, and supports patients with resources such as billing assistance, language and accessibility services, safety and security measures.",
        Recommendation: "A full recommendation on whether to work at Rochester Regional Health cannot be provided with the currently available information, as details on their mission, values, and work environment are not explicitly stated. However, given its extensive healthcare services network and commitment to accessible patient care across multiple specialties and locations, it may offer diverse professional opportunities in healthcare. To provide a more thorough recommendation, additional information about their mission, values, and work environment would be necessary."
      };
    } else if (job.company.includes("Hollister")) {
      // Hollister research data
      return {
        Summary: "Hollister Co. is an American lifestyle retail brand owned by Abercrombie & Fitch Co., founded in 2000 in Ohio. It sells apparel, accessories, and fragrances worldwide through physical stores and online. The brand markets a Southern California-inspired lifestyle rather than focusing on the core surfing market. Hollister stores are designed to resemble vintage beach shacks, though recent redesigns have moved toward more modern, customer-friendly layouts.",
        Recommendation: "Based solely on the information available, working at Hollister Co. may involve navigating some corporate policies that have led to legal challenges and controversies, particularly around discrimination and accessibility issues. However, the company has taken steps to address some concerns (e.g., ADA compliance renovations, revising uniform policies). There is no detailed information on employee satisfaction, benefits, or workplace environment provided on this page. Prospective employees should consider these factors and seek additional sources for insights into workplace culture before deciding."
      };
    } else {
      // Generic research for other companies
      return {
        Summary: "This company operates in a competitive market with opportunities for growth and innovation. Our AI research indicates a dynamic workplace environment with various departments and roles available for career development. The organization maintains industry-standard practices and continues to evolve with market demands. The company culture emphasizes professional growth and skill development.",
        Recommendation: "Based on available information, this position could offer valuable experience and career development opportunities. Consider evaluating the specific role requirements, company culture fit, and growth potential when making your decision. We recommend conducting additional research through employee reviews and company communications to get a complete picture of the work environment and advancement opportunities."
      };
    }
  },
});

export const getResearchHistory = query({
  args: {
    candidateId: v.optional(v.id("candidates")),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    jobId: v.id("jobs"),
    researchDate: v.string(),
    summary: v.string(),
  })),
  handler: async (_ctx, args) => {
    // Mock implementation - return empty array for now
    // In a real implementation, you would store research history in the database
    const limit = args.limit || 10;

    // Return empty array as placeholder
    return [];
  },
});