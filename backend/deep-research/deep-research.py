import os
from dotenv import load_dotenv
from browser_use_sdk import BrowserUse
from pydantic import BaseModel

load_dotenv()

client = BrowserUse(api_key=os.getenv("BROWSER_USE_API_KEY"))

class CompanyResearch(BaseModel):
    summary: str
    recommendation: str

def research_company(company_name: str) -> dict:
    """
    Research a company using web search and return structured analysis.

    Args:
        company_name: Name of the company to research

    Returns:
        Dict with summary and recommendation
    """

    task = client.tasks.create_task(
        task=f"""
        Can you google {company_name} and provide a structured output of:
        {{
        Summary: "String of what {company_name} is"
        Recommendation: "Should I work or not work here?"
        }}
        """,
        llm="gpt-4.1",
        schema=CompanyResearch,
    )

    print(f"Task ID: {task.id}")

    result = task.complete()

    if result.parsed_output is not None:
        return {
            "summary": result.parsed_output.summary,
            "recommendation": result.parsed_output.recommendation
        }
    else:
        return {
            "summary": f"Unable to research {company_name} due to technical issues.",
            "recommendation": "Research failed - please try again later."
        }

def main():
    # Test the function
    company = "Abercrombie & Fitch"
    result = research_company(company)
    print(f"Research for {company}:")
    print(f"Summary: {result['summary']}")
    print(f"Recommendation: {result['recommendation']}")

if __name__ == '__main__':
    main()
