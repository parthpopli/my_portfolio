import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

print("API Key Loaded:", api_key is not None)
print("API Key Prefix:", api_key[:4] if api_key else "NOT FOUND")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1",
)


def generate_ai_summary(project_context: dict):
    if not api_key:
        return {
            "error": "Groq API key missing. Add GROQ_API_KEY in backend/.env."
        }

    prompt = f"""
You are RepoLens AI.

Your task is to analyze a GitHub repository and return ONLY valid JSON.

Repository Name:
{project_context.get("repo_name")}

Tech Stack:
{project_context.get("tech_stack")}

Folders:
{project_context.get("folders")}

Repository Information:
{project_context.get("content")}

Return ONLY this JSON structure:

{{
  "project_overview": "",
  "purpose": "",
  "difficulty": "",
  "important_folders": [
    {{
      "folder": "",
      "description": ""
    }}
  ],
  "where_to_start": [
    ""
  ],
  "setup": {{
    "frontend": [
      ""
    ],
    "backend": [
      ""
    ]
  }},
  "resume_summary": ""
}}

Do not wrap the JSON in markdown.
Do not explain anything outside the JSON.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You return only valid JSON. No markdown. No explanation.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
        )

        raw_text = response.choices[0].message.content

        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            return {
                "project_overview": raw_text,
                "purpose": "",
                "difficulty": "",
                "important_folders": [],
                "where_to_start": [],
                "setup": {
                    "frontend": [],
                    "backend": [],
                },
                "resume_summary": "",
            }

    except Exception as e:
        print("Groq error:", repr(e))
        return {
            "error": f"AI summary generation failed: {str(e)}"
        }
    
def answer_repo_question(question: str, project_context: dict):
    if not api_key:
        return "Groq API key missing."

    prompt = f"""
You are RepoLens AI.

Answer the user's question using only this repository context.

Repository Context:
{project_context}

User Question:
{question}

Give a clear, practical answer.
If the information is not available in the context, say so honestly.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You answer questions about code repositories clearly and practically.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content

    except Exception as e:
        print("Ask RepoLens error:", repr(e))
        return f"Failed to answer question: {str(e)}"    