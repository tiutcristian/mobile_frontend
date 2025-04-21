"use client";
import { createContext, useReducer, useContext, ReactNode } from "react";
import { NetworkActionType, NetworkState, NetworkStateType } from "../types";

export function networkReducer(state: NetworkStateType, action: NetworkActionType): NetworkStateType {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        networkState: action.payload.networkState,
      };
    
    default:
      return state;
  }
}

export const NetworkContext = createContext<
  | { state: NetworkStateType; dispatch: React.Dispatch<NetworkActionType> }
  | undefined
>(undefined);

export function NetworkContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(networkReducer, { networkState: NetworkState.UP, });

  return (
    <NetworkContext.Provider value={{ state, dispatch }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  const context = useContext(NetworkContext);
  if (!context) throw new Error("useNetworkContext must be used within a NetworkContextProvider");
  return context;
}
