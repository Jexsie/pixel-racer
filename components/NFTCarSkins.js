"use client";

import { useEffect } from "react";

const carSkins = [
  { color: "#00bfff", name: "Classic Blue", label: "CLASSIC" },
  { color: "#ff1744", name: "Racing Red", label: "RACING" },
  { color: "#00e676", name: "Neon Green", label: "NEON" },
  { color: "#ffd600", name: "Golden Yellow", label: "GOLDEN" },
  { color: "#e040fb", name: "Purple Haze", label: "PURPLE" },
  { color: "#ff6d00", name: "Sunset Orange", label: "SUNSET" },
  { color: "#00e5ff", name: "Cyber Cyan", label: "CYBER" },
  { color: "#ff4081", name: "Hot Pink", label: "HOT PINK" },
];

export default function NFTCarSkins({ selectedColor, onColorChange }) {
  useEffect(() => {
    // Load saved car color from localStorage
    const savedColor = localStorage.getItem("pixelRacerCarColor");
    if (savedColor) {
      onColorChange(savedColor);
    }
  }, [onColorChange]);

  const handleColorSelect = (color, name, isLocked) => {
    if (isLocked) {
      alert(
        "🔒 This car skin is locked!\n\nConnect your wallet and own the corresponding NFT to unlock exclusive car skins."
      );
      return;
    }

    onColorChange(color);
    localStorage.setItem("pixelRacerCarColor", color);
    console.log(`🎨 Car skin changed to: ${name} (${color})`);
  };

  return (
    <aside className="right-sidebar">
      <div className="sidebar-panel">
        <h2 className="panel-title">🎨 CAR SKINS</h2>
        <div className="panel-content">
          <p className="nft-description">
            Select your car color! Future: Connect wallet to use NFT car skins.
          </p>
          <div className="nft-grid">
            {carSkins.map((skin) => (
              <button
                key={skin.color}
                className={`nft-slot ${
                  selectedColor === skin.color ? "active" : ""
                }`}
                onClick={() => handleColorSelect(skin.color, skin.name, false)}
              >
                <div
                  className="nft-preview"
                  style={{ background: skin.color }}
                />
                <div className="nft-name">{skin.label}</div>
              </button>
            ))}
            <button
              className="nft-slot locked"
              onClick={() => handleColorSelect(null, null, true)}
            >
              <div className="nft-preview locked-preview">
                <span className="lock-icon">🔒</span>
              </div>
              <div className="nft-name">LOCKED</div>
            </button>
          </div>
          <div className="nft-notice">
            <p>
              🔗 <strong>Web3 Feature:</strong> Connect your wallet to unlock
              exclusive NFT car skins!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
