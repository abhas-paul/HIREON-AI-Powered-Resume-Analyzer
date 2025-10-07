interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let textColor = '';
  let badgeText = '';

  if (score > 70) {
    badgeColor = 'bg-green-900/40';
    textColor = 'text-green-400';
    badgeText = 'Strong';
  } else if (score > 49) {
    badgeColor = 'bg-yellow-900/40';
    textColor = 'text-yellow-400';
    badgeText = 'Good Start';
  } else {
    badgeColor = 'bg-red-900/40';
    textColor = 'text-red-400';
    badgeText = 'Needs Work';
  }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor} backdrop-blur-md shadow-md hover:shadow-[0_0_10px_rgba(0,255,0,0.5)] transition-all duration-300`}>
      <p className={`text-sm font-semibold ${textColor} text-center`}>
        {badgeText}
      </p>
    </div>
  );
};

export default ScoreBadge;
