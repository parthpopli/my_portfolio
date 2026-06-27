type StartHereItem = {
  file: string;
  reason: string;
};

type Props = {
  startHere: StartHereItem[];
};

export default function StartHere({ startHere }: Props) {
  if (startHere.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-semibold text-gray-800">📍 Start Here</h3>

      <div className="rounded-xl border border-green-200 bg-green-50">
        {startHere.map((item, index) => (
          <div
            key={index}
            className="border-b border-green-100 px-4 py-3 last:border-b-0"
          >
            <p className="font-semibold text-green-800">
              {index + 1}. {item.file}
            </p>
            <p className="text-sm text-green-700">{item.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}