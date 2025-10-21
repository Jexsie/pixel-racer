"use client";

import { useEffect, useState } from "react";
import { useUserNfts } from "@/hooks/useUserNfts";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";

interface NFTCarSkinsProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function NFTCarSkins({
  selectedColor,
  onColorChange,
}: NFTCarSkinsProps) {
  const { accountId } = useWalletInterface();
  const { nfts: nftSkins, loading } = useUserNfts();

  useEffect(() => {
    // Load saved car color from localStorage
    const savedColor = localStorage.getItem("pixelRacerCarColor");
    if (savedColor) {
      onColorChange(savedColor);
    }
  }, [onColorChange]);

  const handleColorSelect = (
    color: string,
    name: string,
    isLocked: boolean
  ) => {
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
          {!accountId ? (
            <div className="nft-empty-state">
              <div className="nft-empty-icon">🔒</div>
              <p className="nft-empty-text">
                <strong>Connect Your Wallet</strong>
              </p>
              <p className="nft-empty-hint">
                Connect your wallet to display your NFTs as car skins!
              </p>
            </div>
          ) : loading ? (
            <div className="nft-loading-state">
              <div className="loading-spinner"></div>
              <p className="nft-loading-text">Loading your NFT skins...</p>
            </div>
          ) : nftSkins.length === 0 ? (
            <div className="nft-empty-state">
              <div className="nft-empty-icon">📭</div>
              <p className="nft-empty-text">
                <strong>No NFTs Found</strong>
              </p>
              <p className="nft-empty-hint">
                You don&apos;t own any NFTs yet. Get some NFTs on Hedera to use
                them as car skins!
              </p>
            </div>
          ) : (
            <>
              <p className="nft-description">
                ✅ {nftSkins.length} NFT skin{nftSkins.length > 1 ? "s" : ""}{" "}
                found!
              </p>

              <div className="nft-grid">
                {/* NFT skins from user's wallet */}
                {nftSkins.map((nftSkin) => (
                  <button
                    key={`${nftSkin.token_id}-${nftSkin.serial_number}`}
                    className={`nft-slot nft-skin ${
                      selectedColor ===
                      nftSkin.metadataJson?.attributes.find(
                        (attribute) => attribute.trait_type === "background"
                      )?.value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleColorSelect(
                        nftSkin.metadataJson?.attributes.find(
                          (attribute) => attribute.trait_type === "background"
                        )?.value || "",
                        nftSkin.metadataJson?.name || "",
                        false
                      )
                    }
                    title={nftSkin.metadataJson?.name || ""}
                  >
                    <div className="nft-preview nft-image-preview">
                      {nftSkin.metadataJson?.image ? (
                        <img
                          src={nftSkin.metadataJson?.image}
                          alt={nftSkin.metadataJson?.name || ""}
                          onError={(e) => {
                            // Fallback to solid color if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            if (target.parentElement) {
                              target.parentElement.style.background =
                                nftSkin.metadataJson?.attributes.find(
                                  (attribute) =>
                                    attribute.trait_type === "background"
                                )?.value || "";
                            }
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            background:
                              nftSkin.metadataJson?.attributes.find(
                                (attribute) =>
                                  attribute.trait_type === "background"
                              )?.value || "",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </div>
                    <div className="nft-name nft-serial">
                      #{nftSkin.metadataJson?.name || ""} - #
                      {nftSkin.metadataJson?.custom_fields?.game?.name || ""} -
                      #{nftSkin.serial_number}
                    </div>
                  </button>
                ))}
              </div>

              <div className="nft-notice">
                <p>
                  ✅ <strong>NFT Skins Active!</strong> Colors extracted from
                  &apos;background&apos; metadata property.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
