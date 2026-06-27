import axios from "axios";
import { useState } from "react";
import Architecture from "./Architecture";
import AskRepo from "./AskRepo";
import RepoScore from "./RepoScore";
import SearchBar from "./SearchBar";
import StartHere from "./StartHere";

type FileItem = {
  path: string;
  extension: string;
};

type ImportantFolder = {
  folder: string;
  description: string;
};

type StartHereItem = {
  file: string;
  reason: string;
};

type AiSummary = {
  project_overview?: string;
  purpose?: string;
  difficulty?: string;
  important_folders?: ImportantFolder[];
  where_to_start?: string[];
  setup?: {
    frontend?: string[];
    backend?: string[];
  };
  resume_summary?: string;
  error?: string;
};

export default function Hero() {
  const [input, setInput] = useState("");
  const [repoName, setRepoName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [totalFiles, setTotalFiles] = useState(0);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [startHere, setStartHere] = useState<StartHereItem[]>([]);
  const [projectContext, setProjectContext] = useState<any>(null);
  const [repoScore, setRepoScore] = useState<any>(null);
  const [architecture, setArchitecture] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<AiSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setRepoName("");
      setProjectType("");
      setTotalFiles(0);
      setFiles([]);
      setTechStack([]);
      setStartHere([]);
      setProjectContext(null);
      setRepoScore(null);
      setArchitecture(null);
      setAiSummary(null);

      const res = await axios.post("https://repolens-9yab.onrender.com/analyze", {
        repo_url: input.trim(),
      });

      if (!res.data.success) {
        setError(res.data.message || "Something went wrong.");
        return;
      }

      setRepoName(res.data.repo_name);
      setProjectType(res.data.project_type || "");
      setTotalFiles(res.data.total_files || 0);
      setFiles(res.data.files || []);
      setTechStack(res.data.tech_stack || []);
      setStartHere(res.data.start_here || []);
      setProjectContext(res.data.project_context || null);
      setRepoScore(res.data.repo_score || null);
      setArchitecture(res.data.architecture || null);
      setAiSummary(res.data.ai_summary || null);
    } catch (err: any) {
      console.log(err);
      setError("Backend request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-5xl px-6 py-16">
      <section className="text-center">
        <p className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Repository Intelligence Tool
        </p>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-7xl">
          RepoLens
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
          Paste a GitHub repository link and get an AI onboarding guide for the
          codebase.
        </p>
      </section>

      <SearchBar
        input={input}
        setInput={setInput}
        loading={loading}
        onAnalyze={handleAnalyze}
      />

      {error && (
        <p className="mx-auto mt-4 max-w-3xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && (
        <p className="mx-auto mt-4 max-w-3xl rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Cloning, scanning, and generating AI onboarding guide. This may take a
          few seconds...
        </p>
      )}

      {repoName && (
        <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Analysis Result
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">
                  {repoName}
                </h2>

                {projectType && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {projectType}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-gray-100 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
              <p className="text-xs text-gray-500">Files scanned</p>
            </div>
          </div>

          <StartHere startHere={startHere} />

          {repoScore && <RepoScore score={repoScore} />}

          {architecture && <Architecture architecture={architecture} />}

          {projectContext && <AskRepo projectContext={projectContext} />}

          {aiSummary && (
            <div className="mt-6">
              <h3 className="mb-3 font-semibold text-gray-800">
                AI Onboarding Guide
              </h3>

              {aiSummary.error ? (
                <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {aiSummary.error}
                </p>
              ) : (
                <div className="space-y-4 rounded-xl bg-purple-50 p-4 text-sm leading-6 text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Project Overview
                    </h4>
                    <p>{aiSummary.project_overview || "Not available."}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Purpose</h4>
                    <p>{aiSummary.purpose || "Not available."}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Difficulty</h4>
                    <p>{aiSummary.difficulty || "Not available."}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Important Folders
                    </h4>
                    {aiSummary.important_folders &&
                    aiSummary.important_folders.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {aiSummary.important_folders.map((item, index) => (
                          <li key={index}>
                            <strong>{item.folder}</strong>: {item.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Not available.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Where to Start
                    </h4>
                    {aiSummary.where_to_start &&
                    aiSummary.where_to_start.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {aiSummary.where_to_start.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Not available.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Resume Summary
                    </h4>
                    <p>{aiSummary.resume_summary || "Not available."}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-gray-800">Tech Stack</h3>

            {techStack.length === 0 ? (
              <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                No tech stack detected yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-gray-800">Sample Files</h3>

            <div className="rounded-xl border border-gray-200">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700 last:border-b-0"
                >
                  📄 {file.path}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}