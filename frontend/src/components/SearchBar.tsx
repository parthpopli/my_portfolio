type Props = {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  onAnalyze: () => void;
};

export default function SearchBar({
  input,
  setInput,
  loading,
  onAnalyze,
}: Props) {
  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste any GitHub repo URL, or click Analyze to try RepoLens"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        <button
          onClick={onAnalyze}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Analyzing..." : "Analyze Repository"}
        </button>
      </div>
    </section>
  );
}