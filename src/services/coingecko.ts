export type CoinGeckoToken = {
  id: string
  symbol: string
  name: string
}

export const fetchTopTokens = async (): Promise<string[]> => {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch tokens from CoinGecko')
  const data = await response.json() as Array<{ symbol: string }>
  const symbols = data.map((item) => item.symbol.toUpperCase())
  return Array.from(new Set(symbols))
} 