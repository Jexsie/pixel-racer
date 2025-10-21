"use client";

interface LeaderboardEntry {
  rank: string;
  name: string;
  score: number;
  rankClass: string;
}

interface LeaderboardModalProps {
  onClose: () => void;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: "1st", name: "SPEEDKING", score: 3200, rankClass: "rank-1" },
  { rank: "2nd", name: "RACER_X", score: 2800, rankClass: "rank-2" },
  { rank: "3rd", name: "PIXEL_PRO", score: 2000, rankClass: "rank-3" },
  { rank: "4th", name: "TURBO_TOM", score: 1750, rankClass: "" },
  { rank: "5th", name: "DRIFT_QUEEN", score: 1500, rankClass: "" },
  { rank: "6th", name: "NITRO_NICK", score: 1200, rankClass: "" },
  { rank: "7th", name: "ZOOM_ZOEY", score: 980, rankClass: "" },
];

export default function LeaderboardModal({ onClose }: LeaderboardModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay active" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>🏆 LEADERBOARD</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="leaderboard-list">
            {leaderboardData.map((entry, index) => (
              <div
                key={index}
                className={`leaderboard-item ${entry.rankClass}`}
              >
                <span className="rank">{entry.rank}</span>
                <span className="player-name">{entry.name}</span>
                <span className="player-score">{entry.score}</span>
              </div>
            ))}
          </div>
          <div className="web3-notice">
            <p>🔗 Future: Connect wallet to save your high scores on-chain!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
