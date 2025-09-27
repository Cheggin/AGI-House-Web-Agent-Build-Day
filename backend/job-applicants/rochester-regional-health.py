import asyncio
import os
from dotenv import load_dotenv
from browser_use import ActionResult, Agent, Browser, ChatOpenAI, Tools
from browser_use.tools.views import UploadFileAction
import json

# from pathlib import Path
# import shutil

# Load from .env.local file
load_dotenv('/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/.env')

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

    task = f"""
    - Navigate to https://apply.appcast.io/jobs/50590620606/applyboard/apply/
    - Fill out the job application form with the following information: {info}
    - Follow these instructions carefully:
        - Do not skip any fields, even if they are optional. If you do not have the information, make your best guess based on the information provided.
        Fill out the form from top to bottom, never skip a field to come back to it later. When filling out a field, only focus on one field per step. These are the steps:
            1) First name
            2) Last name
            3) Email
            4) Phone number
            5) Resume
                - When you reach the resume upload section, click on the resume upload button and use the 'Upload resume file' tool to upload the resume
            6) Postal code
            7) Country
            8) State
            9) City
            10) Address
            11) Age
            12) Are you legally authorized to work in the country for which you are applying?
            13) Will you now or in the future require sponsorship for employment visa status (e.g., H-1B visa status, etc.) to work legally for Rochester Regional Health?
            14) Do you have, or are you in the process of obtaining, a professional license? Select no.
            15) What drew you to healthcare?
            16) How many years of experience do you have in a related role?
            17) Gender
            18) Race
            19) Hispanic/Latino
            20) Veteran status
            21) Disability status
            22) Today's date
    - If you encounter anything you are unsure of, infer the answer based on the information provided.
    - When you reach the resume upload section, click on the resume upload button and use the 'Upload resume file' tool to upload the resume
    - When you are at the bottom of the page, complete the task using the 'Complete the task' tool.
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

    return history.structured_output

async def main():
    llm = ChatOpenAI(model="gpt-4.1-mini")

    # my_info = {
    #     "first_name": "Shawn",
    #     "last_name": "Pana",
    #     "email": "panashawnu@gmail.com",
    #     "phone": "209-629-0825",
    #     "age": "21",
    #     "US_citizen": True,
    #     "sponsorship_needed": False,

    #     "resume": "Link to resume",
    #     "postal_code": "92117",
    #     "country": "United States",
    #     "city": "San Diego",
    #     "address": "5455 Conrad Ave",

    #     "gender": "Male",
    #     "race": "Asian",
    #     "Veteran_status": "Not a veteran",
    #     "disability_status": "No disability"
    # }

    # load json into dict from /Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_data.json
    with open('/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_data.json') as f:
        mock_info = json.load(f)

    results = await apply_to_rochester_regional_health(mock_info, llm, resume_path="/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_CV.pdf")
    print("Search Results:", results)

if __name__ == '__main__':
  asyncio.run(main())
