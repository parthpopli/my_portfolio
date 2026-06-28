type Props = {
  architecture: {
    type: string;
    layers: string[];
    flow: string;
  };
};

export default function Architecture({ architecture }: Props) {
  return (
    <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-5">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">
        🏗 Architecture
      </h3>

      <p className="mb-4 text-sm text-gray-600">
        {architecture.type}
      </p>

      <div className="space-y-2">
        {architecture.layers.map((layer, index) => (
          <div key={index}>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              {layer}
            </div>

            {index < architecture.layers.length - 1 && (
              <div className="py-1 text-center text-2xl">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}