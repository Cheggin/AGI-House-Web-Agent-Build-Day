import asyncio
import os
from dotenv import load_dotenv
from browser_use import ActionResult, Agent, Browser, ChatOpenAI, ChatAnthropic, ChatGoogle, Tools
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
OBJECTIVE: Complete the job application form at https://apply.appcast.io/jobs/50590620606/applyboard/apply/

SOURCE DATA: {answers.final_result()}
*** This data is your source of truth - refer to it for EVERY field ***

EXECUTION INSTRUCTIONS:

=== PHASE 0: PREPARATION ===
1. Navigate to the URL
2. Wait for page to fully load (3-5 seconds)
3. Handle any popups:
   - If cookie banner appears, accept or close it
   - If any modal/overlay blocks the form, close it immediately
   - If chat widget appears, minimize or close it
4. Scroll through entire page once to understand structure
5. Return to top of form

=== PHASE 1: TEXT INPUT FIELDS (Legal Name & Contact) ===
For each field below, follow this pattern:
- Scroll until field is visible
- Click directly on the input field (not the label)
- Clear any existing content
- Type the value from source data
- Verify the text was entered correctly

Fields to complete:
1. "Legal First Name" or "First Name" (marked with *)
   - Look for input field with placeholder or label containing "First"
   - Enter the firstName from source data
   
2. "Legal Last Name" or "Last Name" (marked with *)
   - Look for input field with placeholder or label containing "Last"
   - Enter the lastName from source data
   
3. "Email" (marked with *)
   - Look for input field with type="email" or label "Email"
   - Enter the complete email address from source data
   
4. "Phone" (marked with *)
   - Look for input field with tel type or phone label
   - If country code dropdown exists, ensure it shows +1 (USA)
   - Enter phone number from source data
   - Accept various formats: xxx-xxx-xxxx or xxxxxxxxxx

=== PHASE 2: FILE UPLOAD ===
5. Resume Upload:
   - Scroll to "Resume" section
   - Look for button with text "Upload Resume" or file input element
   - Alternative selectors: button with document/paperclip icon
   - Use upload_file_to_element action
   - Wait 2-3 seconds for upload to complete
   - Verify file name appears on page

=== PHASE 3: ADDRESS FIELDS ===
Complete in this exact order (some fields may populate others):

6. "Postal code" or "ZIP code"
   - Enter the postCode/ZIP from source data
   - **WAIT 2-3 seconds after entering ZIP**
   - Check if City and/or Country auto-populated
   - If they auto-populated, verify they match source data:
     * Country should show "United States" or "USA"
     * City should show the correct city from source data
   - **SKIP to step 8 if both Country and City are auto-filled correctly**
   
7. "Country" (marked with *) - **ONLY fill if not auto-populated**
   - Check if already filled from ZIP code
   - If empty or incorrect:
     * Click to open dropdown
     * Select "United States" or "USA"
     * Wait for any dynamic updates
   - If already shows "United States" or "USA", SKIP this field
   
8. "State"
   - May be dropdown or text field
   - Check if auto-populated from ZIP
   - If empty or incorrect:
     * If dropdown: select state matching source data
     * If text: enter state abbreviation (e.g., "CT")
   - If already correct, SKIP this field
   
9. "City" - **ONLY fill if not auto-populated**
   - Check if already filled from ZIP code
   - If empty or incorrect:
     * Enter city name from source data
   - If already shows correct city, SKIP this field
   
10. "Address Line" or "Street Address"
    - This field typically does NOT auto-populate
    - Enter full street address from source data

IMPORTANT AUTO-FILL NOTES:
- MAKE SURE YOU FILLED THE PREVIOUS ELEMENT BEFORE YOU MOVE ON
- After entering ZIP code, ALWAYS pause 2-3 seconds
- Check which fields auto-populated before proceeding
- Only fill fields that remain empty or have incorrect values
- Common auto-fill behavior:
  * ZIP → City (usually populated)
  * ZIP → State (sometimes populated)
  * ZIP → Country (usually defaults to USA)
- Verify auto-filled values match source data
- Only manually fill if auto-fill is wrong or missing

=== PHASE 4: RADIO BUTTON SELECTIONS (CRITICAL) ===
*** For radio buttons: Click the actual circle/button, NOT the text label ***

11. "Are you over the age of 18?" (marked with *)
    - Find the radio button group
    - Click the radio button (circle) next to "Yes"
    - Verify the button shows as selected (filled)
    
12. "Are you eligible to work in the United States?" (marked with *)
    - Find the radio button group
    - Based on eligibilityToWork in source data:
      - If true: Click "Yes" radio button
      - If false: Click "No" radio button
    - Verify selection
    
13. "Will you require sponsorship for employment visa?" (marked with *)
    - Find the radio button group
    - Check source data for visa/sponsorship info
    - Default: Click "No" radio button
    - Verify selection
    
    
14. "Do you have or are obtaining a professional license?" SCAN THOROUGHLY FOR THIS QUESTION AND ANSWER IT, AS IT IS OFTEN NOT ANSWERED BY THE AGENT.
    *** CRITICAL: ALWAYS SELECT "NO" FOR THIS FIELD ***
    - Find the radio button group
    - Click "No" radio button
    - Verify "No" is selected

=== PHASE 5: TEXT AREA ===
15. "What drew you to healthcare?"
    - Find the text area/large text field
    - Click inside the text area
    - If no specific answer in source data, enter:
      "I am passionate about making a meaningful impact in people's lives through healthcare. My skills and experience align well with the healthcare industry's mission of improving patient outcomes and quality of life."
    - Or use any relevant text from profileSummary in source data

=== PHASE 6: DROPDOWN SELECTIONS ===
*** For dropdowns: Click to open first, then select option ***

16. "Years of experience in related role" (marked with *)
    - Click dropdown to open
    - Calculate years from jobExperiences in source data
    - Select closest matching range (e.g., "10-15 years", "15+ years")
    
17. "Gender" (Voluntary Disclosure)
    - Click dropdown to open
    - Select option matching source data
    - If not specified: Select "Prefer not to answer"
    
18. "Race/Ethnicity" (Voluntary Disclosure) MAKE SURE TO FULLY CLICK ON THE CORRECT RACE AND ETHNICITY ON THE DROPDOWN, AS THIS DROPDOWN IS OFTEN CLICKED AND THEN SKIPPED.
    - Click dropdown to open
    - Select option matching source data
    - If not specified: Select "Prefer not to answer"
    
19. "Hispanic or Latino" (marked with *)
    - This may be radio buttons or dropdown
    - Select based on source data
    - Default: "No" if not specified


20. "Veteran Status": this is under this section: An Armed Forces Service Medal Veteran: A veteran who, whole serving on active duty in the U.S. military, ground, naval or air service, participated in a United States military operation for which an Armed Forces Service Medal was awarded pursuant to Executive Order 12985. 
    - Click dropdown to open
    - Select option matching source data
    - Default: "I am not a veteran" if not specified
    
21. "Disability Status" (Voluntary Self-Identification) MAKE SURE TO BE THOROGUH WITH THIS AS IT HAS BEEN SKIPPED BY THE AGENT BEFORE. 
    - Radio buttons in a vertical list. Select the first one in the list of three.
    - Select based on source data
    - Default: "No, I do not have a disability"

=== PHASE 7: FINAL FIELD ===
22. "Please enter today's date" (marked with *)
    - This may be a date picker or text field
    - If date picker: Click and select today's date
    - If text field: Enter in format MM/DD/YYYY
    - Use the actual current date

24. Submit:
    - Locate blue "Submit your application" button
    - Should be at bottom of page
    - Click the submit button
    - Wait for confirmation or next page

=== ERROR HANDLING ===
- If validation error appears: Read message, fix the field, continue
- If field won't accept input: Click elsewhere, then click back on field
- If dropdown won't open: Try clicking the arrow icon specifically
- If radio button won't select: Click directly on the circle, not the label
- If upload fails: Try clicking the upload area instead of button

=== OUTPUT REQUIREMENTS ===
After completion, provide:

1. HUMAN-READABLE SUMMARY:
   "Successfully completed job application form with the following actions:
    - Filled [X] text input fields
    - Uploaded resume document
    - Selected [X] radio button options
    - Completed [X] dropdown selections
    - Answered [X] text area questions
    - Total fields completed: [X]
    - Form submitted: [Yes/No]"

2. QUESTIONS ENCOUNTERED:
   List every question/field label found on the page in order:
   - Field name | Field type | Value entered | Required?
   
Example:
   - Legal First Name | text | [value] | Required
   - Email | email | [value] | Required
   - Years of Experience | dropdown | [value] | Required

=== CRITICAL REMINDERS ===
- DO NOT skip any field, even optional ones
- DO NOT use done action until form is submitted
- ALWAYS select "No" for professional license question
- CLOSE any popups/overlays that block the form
- REFER to source data for every single field
- If source data lacks info, use reasonable defaults
- Complete fields sequentially from top to bottom

The task is ONLY complete when you've:
1. Filled every single field
2. Clicked submit button
3. Received confirmation
4. Provided the summary and questions list


If you do not see any boxes to fill, scroll until you find one.


DO THESE TASKS AS QUICKLY AS POSSIBLE YET THOROUGHLY. DO NOT MAKE MISTAKES.
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

    browser.close()

    return history.final_result()

async def main():
    llm = ChatOpenAI(model='o3')

    # load json into dict from /Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_data.json
    with open('/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_data.json') as f:
        mock_info = json.load(f)

    results = await apply_to_rochester_regional_health(mock_info, llm, resume_path="/Users/shawnpana/Documents/GitHub/AGI-House-Web-Agent-Build-Day/backend/mock/test_CV.pdf")
    print("Search Results:", results)

if __name__ == '__main__':
  asyncio.run(main())
