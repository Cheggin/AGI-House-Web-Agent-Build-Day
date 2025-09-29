import asyncio
import os
from dotenv import load_dotenv
from browser_use import ActionResult, Agent, Browser, ChatOpenAI, ChatAnthropic, ChatGoogle, Tools
from browser_use.tools.views import UploadFileAction
import json

# from pathlib import Path
# import shutil

# Load from .env.local file
load_dotenv('/Users/shawnpana/Documents/GitHub/bu-projects/AGI-House-Web-Agent-Build-Day/backend/.env')

async def apply_to_rochester_regional_health(info: dict, llm: str, resume_path: str):
    """
    json format:
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "555-555-5555",
        "age": "21",
        "US_citizen": boolean,
        "sponsorship_needed": boolean,

        "resume": "Link to resume",
        "postal_code": "12345",
        "country": "USA",
        "city": "Rochester",
        "address": "123 Main St",

        "gender": "Male",
        "race": "Asian",
        "Veteran_status": "Not a veteran",
        "disability_status": "No disability"
    }
    """

    # fs_root = Path("/srv/agent/files")
    # fs_root.mkdir(parents=True, exist_ok=True)

    # shutil.copy("/Users/shawnpana/Documents/resume.pdf", fs_root / "resume.pdf")

    tools = Tools()

    @tools.action(description='Upload resume file')
    async def upload_resume(browser_session):
        params = UploadFileAction(
            path=resume_path
        )
        return "Ready to upload resume"


    browser = Browser(
        # use_cloud=True,
        keep_alive=True
    )
    # file_system = FileSystem(root_dir=fs_root)                    # points to /srv/agent/files
    # available_file_paths = []

    answer_agent = Agent(
        task=f"Navigate to https://apply.appcast.io/jobs/50590620606/applyboard/apply/ and scroll through the entire application and use extract_structured_data action to extract all the relevant information needed to fill out the job application form. use this information and return a structured output that can be used to fill out the entire form: {info}. Use the done action to finish the task.",
        llm=llm,
        browser=browser,
        tools=tools,
        # available_file_paths=available_file_paths,
    )

    answers = await answer_agent.run()
    print(answers.final_result())

    task = f"""
    - Navigate to https://apply.appcast.io/jobs/50590620606/applyboard/apply/
    - Fill out the job application form with the following information: {answers.final_result()}
        - Before completing every step, refer to this information for accuracy. It is structured in a way to help you fill out the form and is the source of truth.
    - Follow these instructions carefully:
        - Do not skip any fields, even if they are optional. If you do not have the information, make your best guess based on the information provided.
        Fill out the form from top to bottom, never skip a field to come back to it later. When filling out a field, only focus on one field per step. For each of these steps, scroll to the related text. These are the steps:
            1) use input_text action to fill out the following:
                - "First name"
                - "Last name"
                - "Email"
                - "Phone number"
            2) use the upload_file_to_element action to fill out the following: 
                - Resume upload field
            3) use input_text action to fill out the following:
                - "Postal code"
                - "Country"
                - "State"
                - "City"
                - "Address"
                - "Age"
            4) use click_element_by_index action to select the following options:
                - "Are you legally authorized to work in the country for which you are applying?"
                - "Will you now or in the future require sponsorship for employment visa status (e.g., H-1B visa status, etc.) to work legally for Rochester Regional Health?"
                - "Do you have, or are you in the process of obtaining, a professional license?"
                    - SELECT NO FOR THIS FIELD
            5) use input_text action to fill out the following:
                - "What drew you to healthcare?"
            6) use click_element_by_index action to select the following options:
                - "How many years of experience do you have in a related role?"
                - "Gender"
                - "Race"
                - "Hispanic/Latino"
                - "Veteran status"
                - "Disability status"
            7) use input_text action to fill out the following:
                - "Today's date"
    - Before you start, create a step-by-step plan to complete the entire task. make sure the delegate a step for each field to be filled out.
    *** IMPORTANT ***: 
        - You are not done until you have filled out every field of the form.
        - When you have completed the entire form, perform the done action to finish the task.
        - PLACE AN EMPHASIS ON STEP 4, the click_element_by_index action. That section should be filled out.
        - if anything pops up that blocks the form, close it out and continue filling out the form.
        - At the end of the task, structure your final_result as 1) a human-readable summary of all detections and actions performed on the page with 2) a list with all questions encountered in the page.
    """

    available_file_paths = [resume_path]

    agent = Agent(
        task=task,
        llm=llm,
        browser=browser,
        tools=tools,
        available_file_paths=available_file_paths,
    )

    history = await agent.run()

    await browser.close()

    return history.final_result()

async def main():
    # llm = ChatOpenAI(model='gpt-4.1-mini')
    llm = ChatAnthropic(model='claude-sonnet-4-5')

    # load json into dict from /Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_data.json
    with open('/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_data.json') as f:
        mock_info = json.load(f)

    results = await apply_to_rochester_regional_health(mock_info, llm, resume_path="/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_CV.pdf")
    print("Search Results:", results)

if __name__ == '__main__':
  asyncio.run(main())
