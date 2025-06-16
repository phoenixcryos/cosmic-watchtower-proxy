$content = @'
# Cosmic Watchtower - API Proxy Backend

This project contains the serverless backend API for the Cosmic Watchtower application. It acts as a proxy between the React frontend and several third-party science APIs, handling API keys, CORS, and data aggregation. It is designed for easy deployment on [Vercel](https://vercel.com).

## Prerequisites

- Node.js (v18.x or later recommended)
- A Vercel account
- Vercel CLI installed globally (`npm i -g vercel`)

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [your-repository-name]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Environment Variables

This project requires a NASA API key to fetch data from the DONKI (Database Of Notifications, Knowledge, Information) API.

### For Local Development

1.  Create a file named `.env` in the root of the project.
2.  Get your API key from [api.nasa.gov](https://api.nasa.gov/).
3.  Add the key to your `.env` file:
    ```
    NASA_API_KEY=your_nasa_api_key_goes_here
    ```
The `.gitignore` file is configured to ignore `.env` files, so you won't commit your secret key.

### For Production on Vercel

1.  Navigate to your project's dashboard on Vercel.
2.  Go to the **Settings** tab, then click on **Environment Variables**.
3.  Create a new environment variable:
    -   **Name:** `nasa_api_key` (this name is referenced in `vercel.json`).
    -   **Value:** `your_nasa_api_key_goes_here`
4.  Choose the environments (Production, Preview, Development) you want this key to be available in.
5.  Save the variable. Vercel will automatically trigger a new deployment with the updated environment.

## Running Locally

To run the serverless functions on your local machine for development and testing, use the Vercel CLI:

```bash
vercel dev