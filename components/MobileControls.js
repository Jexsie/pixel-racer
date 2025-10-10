"use client";

export default function MobileControls({ onMoveLeft, onMoveRight }) {
  return (
    <div className="mobile-controls" id="mobileControls">
      <button className="mobile-btn" onClick={onMoveLeft}>
        ◄
      </button>
      <button className="mobile-btn" onClick={onMoveRight}>
        ►
      </button>
    </div>
  );
}
