import axios from "axios";
import { useState } from "react";

type Props = {
  projectContext: any;
};

export default function AskRepo({ projectContext }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setAsking(true);
      setAnswer("");

      const res = await axios.post("http://13.233.113.56:8000/ask", {
        question: question.trim(),
        project_context: projectContext,
      });

      setAnswer(res.data.answer || "No answer received.");
    } catch (error) {
      console.log(error);
      setAnswer("Failed to get answer.");
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <h3 className="mb-3 font-semibold text-gray-800">💬 Ask RepoLens</h3>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask: Where should I add dark mode?"
          className="flex-1 rounded-xl border border-indigo-200 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-indigo-100"
        />

        <button
          onClick={handleAsk}
          disabled={asking}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {asking ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="mt-4 whitespace-pre-line rounded-xl bg-white p-4 text-sm leading-6 text-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
}