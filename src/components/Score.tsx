interface ScoreProps {
  score: number;
  lines: number;
  level: number;
}

export default function Score({ score, lines, level }: ScoreProps) {
  return (
    <div className="bg-gray-700 rounded-lg p-4 space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-400">Score</span>
        <span className="font-bold text-lg">{score.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Lines</span>
        <span className="font-bold">{lines}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Level</span>
        <span className="font-bold">{level}</span>
      </div>
    </div>
  );
}