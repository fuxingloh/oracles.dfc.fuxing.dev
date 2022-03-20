import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

const CRYPTO = ['BTC', 'ETH', 'DFI', 'USDC', 'USDT', 'DOGE', 'LTC', 'BCH']
const CURRENCY = ['SGD', 'EUR']
const IEX_CLOUD_API_TOKEN = process.env.IEX_CLOUD_API_TOKEN

export interface StockSplit {
  symbol: string
  description: string
  /**
   * In seconds.
   */
  expectedTime: number
  factor: {
    from: number
    to: number
  }
}

export default async function handle (req: NextApiRequest, res: NextApiResponse<StockSplit[]>): Promise<void> {
  const symbol = req.query.symbol
  if (Array.isArray(symbol)) {
    res.status(400)
    return
  }

  const splits = await getStockSplit(symbol as string)

  res.status(200)
    .setHeader('Cache-Control', 'max-age=86400, public')
    .json(splits)
}

async function getStockSplit (symbol: string): Promise<StockSplit[]> {
  if (isIgnoredSymbol(symbol)) {
    return []
  }

  const response = await fetch(`https://cloud.iexapis.com/stable/stock/${symbol}/splits/next?token=${IEX_CLOUD_API_TOKEN}`)
  if (response.status === 404) {
    return []
  }

  if (response.status !== 200) {
    throw new Error(`error: ${response.status}`)
  }

  try {
    const body: any = await response.json()
    if (body.length === 0) {
      return []
    }

    return body.map((item: any): StockSplit => {
      return {
        symbol: symbol,
        description: item.description,
        expectedTime: Math.floor(new Date(item.exDate).getTime() / 1000),
        factor: {
          from: item.fromFactor,
          to: item.toFactor
        }
      }
    })
  } catch (e) {
    throw new Error(`error: unknown`)
  }
}

function isIgnoredSymbol (symbol: string): boolean {
  if (CRYPTO.includes(symbol)) {
    return true
  }

  if (CURRENCY.includes(symbol)) {
    return true
  }

  return false
}
