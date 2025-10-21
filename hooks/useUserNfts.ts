"use client";

import { useState, useEffect, useCallback } from "react";
import { MirrorNodeClient, NftInfo } from "@/services/wallets/mirrorNodeClient";
import { useWalletInterface } from "@/services/wallets/useWalletInterface";
import { appConfig } from "@/config";

interface UseUserNftsReturn {
  nfts: NftInfo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  hasNfts: boolean;
}

/**
 * Custom hook to fetch NFTs for the connected wallet
 * @returns NFTs data, loading state, error, and refetch function
 */
export const useUserNfts = (): UseUserNftsReturn => {
  const { accountId } = useWalletInterface();
  const [nfts, setNfts] = useState<NftInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);

  const fetchNfts = useCallback(async () => {
    if (!accountId) {
      setNfts([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all NFTs for the account
      const fetchedNfts = await mirrorNodeClient.getAllAccountNfts(accountId);
      setNfts(fetchedNfts);
      console.log(
        `✅ Fetched ${fetchedNfts.length} NFTs for account ${accountId}`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch NFTs";
      setError(errorMessage);
      console.error("Error fetching NFTs:", err);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  // Fetch NFTs when account changes
  useEffect(() => {
    fetchNfts();
  }, [fetchNfts]);

  return {
    nfts,
    loading,
    error,
    refetch: fetchNfts,
    hasNfts: nfts.length > 0,
  };
};
