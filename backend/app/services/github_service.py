import os
import subprocess
import shutil
import uuid
import re
import stat
import time
import json

TEMP_DIR = "temp_repos"


def validate_github_url(repo_url: str):
    return repo_url is not None and "github.com" in repo_url


def extract_repo_name(repo_url: str):
    match = re.search(r"github\.com/.+?/([^/]+?)(?:\.git)?/?$", repo_url)

    if not match:
        return None

    return match.group(1)


def clone_github_repo(repo_url: str):
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)

    repo_id = str(uuid.uuid4())
    repo_path = os.path.join(TEMP_DIR, repo_id)

    try:
        subprocess.run(
            ["git", "clone", "--depth", "1", repo_url, repo_path],
            check=True,
        )

        return repo_path

    except Exception as e:
        print("❌ Git clone failed:", e)

        if os.path.exists(repo_path):
            cleanup_repo(repo_path)

        return None


def get_repo_tree(repo_path: str):
    tree = []

    ignored_dirs = {
        ".git",
        "node_modules",
        "__pycache__",
        ".venv",
        "venv",
        "dist",
        "build",
        ".next",
    }

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, repo_path)

            tree.append({
                "path": relative_path.replace("\\", "/"),
                "extension": os.path.splitext(file)[1],
            })

    return tree


def detect_repository_type(tech_stack, repo_tree):
    techs = set(tech_stack)
    file_paths = [file["path"].lower() for file in repo_tree]

    has_frontend = (
        "React" in techs
        or "Next.js" in techs
        or "Vue" in techs
        or "Angular" in techs
    )

    has_backend = (
        "FastAPI" in techs
        or "Flask" in techs
        or "Django" in techs
        or "Node.js" in techs
    )

    has_static_site = (
        any(path.endswith("index.html") for path in file_paths)
        and any(path.endswith(".css") for path in file_paths)
        and any(path.endswith(".js") for path in file_paths)
    )

    has_cpp = any(path.endswith(".cpp") or path.endswith(".hpp") for path in file_paths)
    has_java = any(path.endswith(".java") for path in file_paths)
    has_notebooks = any(path.endswith(".ipynb") for path in file_paths)

    if has_frontend and has_backend:
        return "Full-Stack Web Application"

    if has_frontend:
        return "Frontend Web Application"

    if has_backend:
        return "Backend API"

    if has_static_site:
        return "Static Portfolio / Website"

    if has_cpp:
        return "C++ Application"

    if has_java:
        return "Java Application"

    if has_notebooks:
        return "Machine Learning / Data Science Project"

    return "General Software Project"


def get_start_here_files(repo_tree):
    priorities = [
        ("README.md", "Project documentation and overview"),
        ("readme.md", "Project documentation and overview"),
        ("package.json", "Project dependencies and npm scripts"),
        ("requirements.txt", "Python dependencies"),
        ("pyproject.toml", "Python project configuration"),
        ("Dockerfile", "Container configuration"),
        ("docker-compose.yml", "Local development services"),
        ("main.py", "Python application entry point"),
        ("app.py", "Python application entry point"),
        ("manage.py", "Django application entry point"),
        ("index.html", "Main HTML entry point"),
        ("index.js", "JavaScript entry point"),
        ("script.js", "Main JavaScript logic"),
        ("main.js", "Main JavaScript logic"),
        ("index.ts", "TypeScript entry point"),
        ("main.ts", "Application entry point"),
        ("main.tsx", "React application entry point"),
        ("App.tsx", "Main React component"),
        ("vite.config.ts", "Vite configuration"),
        ("style.css", "Main stylesheet"),
        ("styles.css", "Main stylesheet"),
        (".env.example", "Required environment variables"),
    ]

    important = []
    seen = set()

    for filename, reason in priorities:
        for file in repo_tree:
            path = file["path"]
            lower_path = path.lower()

            if lower_path.endswith(filename.lower()) and path not in seen:
                important.append({
                    "file": path,
                    "reason": reason,
                })
                seen.add(path)

    if len(important) < 5:
        for file in repo_tree:
            path = file["path"]
            extension = file["extension"]

            if path in seen:
                continue

            if extension in [".html", ".js", ".ts", ".tsx", ".py", ".css"]:
                important.append({
                    "file": path,
                    "reason": "Important source file for understanding project behavior",
                })
                seen.add(path)

            if len(important) >= 5:
                break

    return important[:5]


def detect_tech_stack(repo_path: str):
    tech_stack = set()

    ignored_dirs = {
        ".git",
        "node_modules",
        "venv",
        ".venv",
        "__pycache__",
        "dist",
        "build",
        ".next",
    }

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for file in files:
            file_lower = file.lower()
            full_path = os.path.join(root, file)

            if file_lower == "package.json":
                tech_stack.add("JavaScript")
                tech_stack.add("Node.js")

                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        content = f.read().lower()

                    if "react" in content:
                        tech_stack.add("React")

                    if "vite" in content:
                        tech_stack.add("Vite")

                    if "typescript" in content:
                        tech_stack.add("TypeScript")

                    if "tailwindcss" in content:
                        tech_stack.add("Tailwind CSS")

                    if "axios" in content:
                        tech_stack.add("Axios")

                    if "next" in content:
                        tech_stack.add("Next.js")

                except Exception:
                    pass

            if file_lower in ["requirements.txt", "pyproject.toml"]:
                tech_stack.add("Python")

                try:
                    with open(full_path, "r", encoding="utf-8") as f:
                        content = f.read().lower()

                    if "fastapi" in content:
                        tech_stack.add("FastAPI")

                    if "uvicorn" in content:
                        tech_stack.add("Uvicorn")

                    if "django" in content:
                        tech_stack.add("Django")

                    if "flask" in content:
                        tech_stack.add("Flask")

                except Exception:
                    pass

            if file_lower.endswith(".html"):
                tech_stack.add("HTML")

            if file_lower.endswith(".css"):
                tech_stack.add("CSS")

            if file_lower.endswith(".tsx") or file_lower.endswith(".jsx"):
                tech_stack.add("React")

            if file_lower.endswith(".ts"):
                tech_stack.add("TypeScript")

            if file_lower.endswith(".js"):
                tech_stack.add("JavaScript")

            if file_lower.endswith(".py"):
                tech_stack.add("Python")

            if file_lower.endswith(".sql"):
                tech_stack.add("SQL")

            if file_lower == "dockerfile":
                tech_stack.add("Docker")

            if file_lower in ["docker-compose.yml", "docker-compose.yaml"]:
                tech_stack.add("Docker Compose")

    return sorted(list(tech_stack))


def get_folder_structure(repo_path: str):
    folders = []

    ignored_dirs = {
        ".git",
        "node_modules",
        "__pycache__",
        ".venv",
        "venv",
        "dist",
        "build",
        ".next",
    }

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]

        for directory in dirs:
            full_path = os.path.join(root, directory)
            relative_path = os.path.relpath(full_path, repo_path)

            folders.append(relative_path.replace("\\", "/"))

    return folders[:20]


def extract_readme(repo_path: str):
    possible_names = ["README.md", "readme.md", "README.txt", "Readme.md"]

    for name in possible_names:
        readme_path = os.path.join(repo_path, name)

        if os.path.exists(readme_path):
            try:
                with open(readme_path, "r", encoding="utf-8") as file:
                    content = file.read()

                return content[:3000]

            except Exception as e:
                print("⚠️ README read failed:", e)
                return ""

    return ""


def build_project_context(
    repo_name,
    tech_stack,
    folder_structure,
    repo_tree,
    readme,
    start_here=None,
    project_type=None,
):
    if readme:
        source = "README + repository intelligence"
        content = readme[:1500]
    else:
        source = "Repository structure + important files"
        important_files = [file["path"] for file in repo_tree[:30]]
        content = "\n".join(important_files)

    return {
        "repo_name": repo_name,
        "source": source,
        "project_type": project_type,
        "tech_stack": tech_stack,
        "folders": folder_structure[:20],
        "start_here": start_here or [],
        "content": content,
    }


def handle_remove_readonly(func, path, exc_info):
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception:
        pass

def calculate_repo_score(repo_tree, folder_structure, tech_stack, readme):
    file_paths = [file["path"].lower() for file in repo_tree]
    folders = [folder.lower() for folder in folder_structure]

    score = 0
    strengths = []
    missing = []

    checks = [
        ("README", bool(readme), 2),
        ("Git Ignore", ".gitignore" in file_paths, 1),
        ("License", any("license" in path for path in file_paths), 1),
        ("Tests", any("test" in path or "spec" in path for path in file_paths + folders), 2),
        ("Docker", "Docker" in tech_stack or "Docker Compose" in tech_stack, 1),
        ("CI/CD", any(".github/workflows" in folder for folder in folders), 2),
        ("Environment Example", any(".env.example" in path for path in file_paths), 1),
    ]

    total_possible = sum(points for _, _, points in checks)

    for name, passed, points in checks:
        if passed:
            score += points
            strengths.append(name)
        else:
            missing.append(name)

    final_score = round((score / total_possible) * 10, 1)

    return {
        "score": final_score,
        "strengths": strengths,
        "missing": missing,
    }


def detect_architecture(project_type, tech_stack):
    techs = set(tech_stack)

    layers = []

    if "React" in techs or "Next.js" in techs:
        layers.append("Frontend UI")

    if "Axios" in techs:
        layers.append("API Client")

    if "FastAPI" in techs or "Flask" in techs or "Django" in techs:
        layers.append("Backend API")

    if "Node.js" in techs and "React" not in techs:
        layers.append("Node Backend")

    if "SQL" in techs:
        layers.append("Database Layer")

    if "Docker" in techs:
        layers.append("Containerization")

    if not layers:
        if project_type == "Static Portfolio / Website":
            layers = ["Static HTML", "CSS Styling", "JavaScript Interactivity"]
        else:
            layers = ["General Application"]

    return {
        "type": project_type,
        "layers": layers,
        "flow": " → ".join(layers),
    }


def cleanup_repo(repo_path: str):
    try:
        time.sleep(0.5)
        shutil.rmtree(repo_path, onerror=handle_remove_readonly)
    except Exception as e:
        print("⚠️ Cleanup failed:", e)