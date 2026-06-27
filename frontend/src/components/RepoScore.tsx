type Props = {
  score: {
    score: number;
    strengths: string[];
    missing: string[];
  };
};

export default function RepoScore({ score }: Props) {
  return (
    <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        ⭐ Repository Health
      </h3>

      <p className="text-4xl font-bold text-yellow-700">
        {score.score}/10
      </p>

      <div className="mt-4">
        <h4 className="font-semibold text-green-700">Strengths</h4>

        <ul className="mt-2 list-disc pl-5">
          {score.strengths.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-red-700">Missing</h4>

        <ul className="mt-2 list-disc pl-5">
          {score.missing.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}