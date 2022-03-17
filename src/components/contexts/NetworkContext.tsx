import { useRouter } from 'next/router'
import { createContext, PropsWithChildren, useContext } from 'react'
import { getNetwork, Network as NetworkObject } from '@defichain/jellyfish-network'

/**
 * What connection is DeFi Scan connected to.
 * This is different from NetworkName, and should not be used as NetworkName.
 */
export enum NetworkConnection {
  MainNet = 'MainNet',
  TestNet = 'TestNet'
}

export const NETWORKS: NetworkConnection[] = [
  NetworkConnection.MainNet,
  NetworkConnection.TestNet
]

export type NetworkName = NetworkObject['name']

export interface NetworkContextObject extends NetworkObject {
  connection: NetworkConnection
}

const NetworkContext = createContext<NetworkContextObject>(undefined as any)

export function useNetwork (): NetworkContextObject {
  return useContext(NetworkContext)
}

export function NetworkProvider (props: PropsWithChildren<any>): JSX.Element | null {
  const router = useRouter()
  const connection = resolveConnection(router.query.network)

  return (
    <NetworkContext.Provider value={mapNetworkObject(connection)}>
      {props.children}
    </NetworkContext.Provider>
  )
}

function mapNetworkObject (connection: NetworkConnection): NetworkContextObject {
  switch (connection) {
    case NetworkConnection.MainNet:
      return { connection: connection, ...getNetwork('mainnet') }
    case NetworkConnection.TestNet:
      return { connection: connection, ...getNetwork('testnet') }
    default:
      throw new Error(`${connection as string} network not found`)
  }
}

function resolveConnection (text: any): NetworkConnection {
  if (text?.toLowerCase() === 'testnet') {
    return NetworkConnection.TestNet
  }

  return NetworkConnection.MainNet
}
