# Job Use  <img src="job-use/public/job-use-logo.svg" alt="Job Use Logo" width="32" height="32" style="vertical-align: bottom; margin-left: 8px;">

## Setup Instructions
1. Clone the repository into your local machine.
2. in the `backend` directory, create a .env file based on the `.env.example` file and fill in the required environment variables.

You need to run three services in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate # On Windows use `.venv\Scripts\activate`
uv pip install -r requirements.txt
python api.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev # you need to set up your own Convex project, see https://docs.convex.dev/quickstart
```

Once all three services are running, open your browser to access the application.

> **Notes**
> - this app is a work in progress, we are continuously improving the functionality and user experience.
> - as of sept. 29, 2025, the backend is mocked and the main functionality is to autofill the Rochester Regional Health application form with mock data. More features will be added soon.
> - From Reagan: We hope to potentially turn this into a full-fledged job platform and perhaps host it with auth and a domain! We could also use Browser Use to do this by scraping / searching for open job applications regularly! 
