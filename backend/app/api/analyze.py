from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_services import generate_ai_summary

from app.services.github_service import (
    validate_github_url,
    extract_repo_name,
    clone_github_repo,
    get_repo_tree,
    get_folder_structure,
    extract_readme,
    detect_tech_stack,
    detect_repository_type,
    get_start_here_files,
    calculate_repo_score,
    detect_architecture,
    build_project_context,
    cleanup_repo,
)

router = APIRouter()


class RepoRequest(BaseModel):
    repo_url: str


@router.post("/analyze")
def analyze_repo(data: RepoRequest):
    repo_url = data.repo_url

    print(f"\nRepository URL received: {repo_url}")

    if not validate_github_url(repo_url):
        return {
            "success": False,
            "message": "Invalid GitHub repository URL.",
        }

    repo_name = extract_repo_name(repo_url)
    repo_path = clone_github_repo(repo_url)

    if not repo_path:
        return {
            "success": False,
            "message": "Failed to clone repository.",
        }

    try:
        repo_tree = get_repo_tree(repo_path)
        tech_stack = detect_tech_stack(repo_path)
        folder_structure = get_folder_structure(repo_path)
        project_type = detect_repository_type(tech_stack, repo_tree)
        start_here = get_start_here_files(repo_tree)
        readme = extract_readme(repo_path)

        repo_score = calculate_repo_score(
            repo_tree=repo_tree,
            folder_structure=folder_structure,
            tech_stack=tech_stack,
            readme=readme,
        )

        architecture = detect_architecture(
            project_type=project_type,
            tech_stack=tech_stack,
        )

        project_context = build_project_context(
            repo_name=repo_name,
            tech_stack=tech_stack,
            folder_structure=folder_structure,
            repo_tree=repo_tree,
            readme=readme,
            start_here=start_here,
            project_type=project_type,
        )

        project_context["repo_score"] = repo_score
        project_context["architecture"] = architecture

        ai_summary = generate_ai_summary(project_context)

        print(f"Total files scanned: {len(repo_tree)}")
        print(f"Tech stack detected: {tech_stack}")
        print(f"Project type detected: {project_type}")
        print(f"Repo score: {repo_score}")
        print(f"Architecture: {architecture}")
        print(f"Start here files: {start_here}")
        print(f"Folders detected: {len(folder_structure)}")
        print(f"README found: {bool(readme)}")
        print("AI summary generated.")

        return {
            "success": True,
            "repo_name": repo_name,
            "project_type": project_type,
            "total_files": len(repo_tree),
            "files": repo_tree[:10],
            "tech_stack": tech_stack,
            "folder_structure": folder_structure,
            "start_here": start_here,
            "repo_score": repo_score,
            "architecture": architecture,
            "readme_preview": readme[:500],
            "project_context": project_context,
            "ai_summary": ai_summary,
        }

    finally:
        cleanup_repo(repo_path)