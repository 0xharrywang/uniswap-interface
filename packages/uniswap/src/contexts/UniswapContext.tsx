import { JsonRpcProvider } from '@ethersproject/providers'
import { Signer } from 'ethers/lib/ethers'
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { AccountMeta } from 'uniswap/src/features/accounts/types'
import { FiatOnRampCurrency } from 'uniswap/src/features/fiatOnRamp/types'
import { UniverseChainId } from 'uniswap/src/types/chains'

/** Stores objects/utils that exist on all platforms, abstracting away app-level specifics for each, in order to allow usage in cross-platform code. */
interface UniswapContext {
  account?: AccountMeta
  navigateToBuyOrReceiveWithEmptyWallet?: () => void
  navigateToFiatOnRamp: (args: { prefilledCurrency?: FiatOnRampCurrency }) => void
  onSwapChainsChanged: (inputChainId: UniverseChainId, outputChainId?: UniverseChainId) => void
  swapInputChainId?: UniverseChainId
  signer: Signer | undefined
  useProviderHook: (chainId: number) => JsonRpcProvider | undefined
  // Used for triggering wallet connection on web
  onConnectWallet?: () => void
  // Used for web to open the token selector from a banner not in the swap flow
  isSwapTokenSelectorOpen: boolean
  setIsSwapTokenSelectorOpen: (open: boolean) => void
}

export const UniswapContext = createContext<UniswapContext | null>(null)

export function UniswapProvider({
  children,
  account,
  navigateToBuyOrReceiveWithEmptyWallet,
  navigateToFiatOnRamp,
  onSwapChainsChanged,
  signer,
  useProviderHook,
  onConnectWallet,
}: PropsWithChildren<Omit<UniswapContext, 'isSwapTokenSelectorOpen' | 'setIsSwapTokenSelectorOpen'>>): JSX.Element {
  const [swapInputChainId, setSwapInputChainId] = useState<UniverseChainId>()
  const [isSwapTokenSelectorOpen, setIsSwapTokenSelectorOpen] = useState<boolean>(false)

  const value: UniswapContext = useMemo(
    () => ({
      account,
      navigateToBuyOrReceiveWithEmptyWallet,
      onSwapChainsChanged: (inputChainId: UniverseChainId, outputChanId?: UniverseChainId): void => {
        onSwapChainsChanged(inputChainId, outputChanId)
        setSwapInputChainId(inputChainId)
      },
      signer,
      useProviderHook,
      navigateToFiatOnRamp,
      onConnectWallet,
      swapInputChainId,
      isSwapTokenSelectorOpen,
      setIsSwapTokenSelectorOpen: (open: boolean) => setIsSwapTokenSelectorOpen(open),
    }),
    [
      account,
      navigateToBuyOrReceiveWithEmptyWallet,
      signer,
      useProviderHook,
      navigateToFiatOnRamp,
      onConnectWallet,
      swapInputChainId,
      onSwapChainsChanged,
      isSwapTokenSelectorOpen,
      setIsSwapTokenSelectorOpen,
    ],
  )

  return <UniswapContext.Provider value={value}>{children}</UniswapContext.Provider>
}

/** Cross-platform util for getting items/utils that exist on all apps. */
export function useUniswapContext(): UniswapContext {
  const context = useContext(UniswapContext)
  if (!context) {
    throw new Error('useUniswapContext must be used within a UniswapProvider')
  }

  return context
}

/** Cross-platform util for getting metadata for the active account/wallet, regardless of platform/environment. */
export function useAccountMeta(): AccountMeta | undefined {
  return useUniswapContext().account
}

/** Cross-platform util for getting an RPC provider for the given `chainId`, regardless of platform/environment. */
export function useProvider(chainId: number): JsonRpcProvider | undefined {
  return useUniswapContext().useProviderHook(chainId)
}

/** Cross-platform util for getting a signer for the active account/wallet, regardless of platform/environment. */
export function useSigner(): Signer | undefined {
  return useUniswapContext().signer
}