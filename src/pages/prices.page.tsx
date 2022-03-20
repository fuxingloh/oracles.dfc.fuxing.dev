import ReactNumberFormat from 'react-number-format'
import { Container } from '@components/commons/Container'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getWhaleApiClient } from '@components/contexts/WhaleContext'
import { PriceTicker } from '@defichain/whale-api-client/dist/api/prices'
import { format } from 'date-fns'
import { ApiPagedResponse } from '@defichain/whale-api-client/dist/whale.api.response'

interface PricesPageProps {
  prices: PriceTicker[]
}

export default function PricesPage ({ prices }: PricesPageProps): JSX.Element {
  return (
    <Container className='pt-8 pb-24'>
      <div>
        <h1 className='font-semibold text-lg mb-6'>
          Total Prices: {prices.length}
        </h1>

        <PricesTable prices={prices} />
      </div>
    </Container>
  )
}

function PricesTable (props: { prices: PriceTicker[] }): JSX.Element {
  return (
    <div className='flex flex-col'>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Ticker
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  USD
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  ORACLES
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Last Published
                </th>
              </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
              {props.prices.map((item) => {
                return <PriceTableRow price={item} key={item.id} />
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function PriceTableRow ({ price: { price } }: { price: PriceTicker }): JSX.Element {
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className=''>
          <div className='text-sm text-gray-500 truncate w-24 font-mono'>{price.token}</div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900 font-mono'>
          <ReactNumberFormat
            value={price.aggregated.amount}
            thousandSeparator
            decimalScale={8}
            displayType='text'
            data-testid='BidAmountValue.MinBidAmount'
          />
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          {price.aggregated.oracles.active}/{price.aggregated.oracles.total}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-500'>{price.block.height}</div>
        <div className='text-sm text-gray-500'>
          {format(price.block.medianTime * 1000, 'MMM dd, hh:mm:ss aa')}
        </div>
      </td>
    </tr>
  )
}

export async function getServerSideProps (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<PricesPageProps>> {
  const api = getWhaleApiClient(context)
  const prices: PriceTicker[] = []

  let res: ApiPagedResponse<PriceTicker>
  do {
    res = await api.prices.list(200)
    prices.push(...res)
  } while (res.hasNext)

  return {
    props: { prices }
  }
}

