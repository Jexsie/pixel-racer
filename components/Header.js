"use client";

export default function Header({ onLeaderboardClick }) {
  const handleWalletClick = () => {
    alert(
      "🔗 Wallet connection coming soon!\n\nFuture features:\n- Connect MetaMask/Web3 wallet\n- Save high scores on-chain\n- Unlock NFT car skins\n- Earn crypto rewards"
    );
  };

  const handleHomeClick = () => {
    if (confirm("Return to home? Your current game will be lost.")) {
      window.location.reload();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="game-title">🏁 PIXEL RACER</h1>
        <nav className="header-nav">
          <button className="pixel-btn" onClick={handleHomeClick}>
            HOME
          </button>
          <button className="pixel-btn" onClick={onLeaderboardClick}>
            LEADERBOARD
          </button>
          <button className="pixel-btn wallet-btn" onClick={handleWalletClick}>
            <span className="wallet-icon">👛</span> CONNECT WALLET
          </button>
        </nav>
      </div>
    </header>
  );
}
