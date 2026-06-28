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

const API_URL = "https://repolens-9yab.onrender.com";
const DEFAULT_REPO_URL = "https://github.com/parthpopli/RepoLens";

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

  const resetResults = () => {
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
  };

  const handleAnalyze = async () => {
    const repoUrl = input.trim() || DEFAULT_REPO_URL;

    try {
      setLoading(true);
      resetResults();

      const res = await axios.post(`${API_URL}/analyze`, {
        repo_url: repoUrl,
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
    <main className="min-h-screen w-full bg-slate-50 px-6 py-12">
      <section className="mx-auto max-w-5xl text-center">
        <p className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          AI Repository Intelligence Platform
        </p>

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 md:text-7xl">
          Understand any GitHub repo
          <span className="block text-blue-600">in seconds.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Paste any GitHub repository link, or simply click Analyze to try
          RepoLens on its own source code.
        </p>

        <p className="mt-3 text-sm text-slate-400">
          Demo repo: {DEFAULT_REPO_URL}
        </p>
      </section>

      <div className="mx-auto max-w-5xl">
        <SearchBar
          input={input}
          setInput={setInput}
          loading={loading}
          onAnalyze={handleAnalyze}
        />

        {error && (
          <p className="mx-auto mt-4 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && (
          <p className="mx-auto mt-4 max-w-3xl rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Cloning, scanning, and generating AI onboarding guide. This may take
            a minute...
          </p>
        )}

        {repoName && (
          <section className="mx-auto mt-8 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Analysis Result
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-950">
                    {repoName}
                  </h2>

                  {projectType && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {projectType}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-100 px-5 py-4 text-center">
                <p className="text-3xl font-bold text-slate-950">
                  {totalFiles}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Files scanned
                </p>
              </div>
            </div>

            <StartHere startHere={startHere} />

            {repoScore && <RepoScore score={repoScore} />}

            {architecture && <Architecture architecture={architecture} />}

            {projectContext && <AskRepo projectContext={projectContext} />}

            {aiSummary && (
              <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  🤖 AI Onboarding Guide
                </h3>

                {aiSummary.error ? (
                  <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {aiSummary.error}
                  </p>
                ) : (
                  <div className="space-y-5 text-sm leading-6 text-slate-700">
                    <div>
                      <h4 className="font-semibold text-slate-950">
                        Project Overview
                      </h4>
                      <p>{aiSummary.project_overview || "Not available."}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-950">Purpose</h4>
                      <p>{aiSummary.purpose || "Not available."}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-950">
                        Difficulty
                      </h4>
                      <p>{aiSummary.difficulty || "Not available."}</p>
                    </div>

                    {aiSummary.important_folders &&
                      aiSummary.important_folders.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-slate-950">
                            Important Folders
                          </h4>
                          <ul className="mt-2 list-disc pl-5">
                            {aiSummary.important_folders.map((item, index) => (
                              <li key={index}>
                                <strong>{item.folder}</strong>:{" "}
                                {item.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div>
                      <h4 className="font-semibold text-slate-950">
                        Where to Start
                      </h4>
                      {aiSummary.where_to_start &&
                      aiSummary.where_to_start.length > 0 ? (
                        <ul className="mt-2 list-disc pl-5">
                          {aiSummary.where_to_start.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not available.</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-950">
                        Resume Summary
                      </h4>
                      <p>{aiSummary.resume_summary || "Not available."}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Tech Stack
              </h3>

              {techStack.length === 0 ? (
                <p className="text-sm text-slate-500">
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

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Sample Files
              </h3>

              <div className="rounded-xl border border-slate-200">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700 last:border-b-0"
                  >
                    📄 {file.path}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
