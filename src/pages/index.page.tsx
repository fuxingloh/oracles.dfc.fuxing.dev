import { Container } from '@components/commons/Container'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { Oracle } from '@defichain/whale-api-client/dist/api/oracles'
import { format } from 'date-fns'
import { getWhaleApiClient, useWhaleApiClient } from '@components/contexts/WhaleContext'
import { useMemo, useState } from 'react'
import { debounce } from 'lodash'

interface IndexPageProps {
  oracles: Oracle[]
}

export default function IndexPage (props: IndexPageProps): JSX.Element {
  const [oracles, setOracles] = useState(props.oracles)
  const onChangeDebounceHandler = useMemo(() => debounce(changeHandler, 200), [])

  async function changeHandler (event: any): Promise<void> {
    const query = event.target.value.trim()

    if (query.length === 0) {
      setOracles(props.oracles)
      return
    }

    setOracles(props.oracles.filter(oracle => {
      return oracle.priceFeeds.find(feed => feed.token.toLowerCase() === query.toLowerCase())
    }))
  }

  return (
    <Container className='pt-8 pb-24'>
      <div>
        <h1 className='font-semibold text-lg'>
          Total Oracles: {oracles.length}
        </h1>

        <div className='my-6 max-w-2xl'>
          <input
            placeholder='Search Price Feed (DFI, AAPL)'
            className='h-full w-full focus:outline-none border p-3 rounded'
            onChange={onChangeDebounceHandler}
          />
        </div>

        <OracleTable oracles={oracles} />
      </div>
    </Container>
  )
}

export async function getServerSideProps (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<IndexPageProps>> {
  const api = getWhaleApiClient(context)

  return {
    props: {
      oracles: await api.oracles.list(200)
    }
  }
}

function OracleTable (props: { oracles: Oracle[] }): JSX.Element {
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
                  Oracle
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Balance
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Weightage
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Price Feeds
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Activated At
                </th>
              </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
              {props.oracles.map((oracle) => {
                return <OracleTableRow oracle={oracle} key={oracle.id} />
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function OracleTableRow ({ oracle }: { oracle: Oracle }): JSX.Element {
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className=''>
          <div className='text-sm font-medium text-gray-900 truncate w-24 font-mono'>{oracle.ownerAddress}</div>
          <div className='text-sm text-gray-500 truncate w-24 font-mono'>{oracle.id}</div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>
          <AddressBalance address={oracle.ownerAddress} />
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-900'>{oracle.weightage}</div>
      </td>
      <td className='px-6 py-3 whitespace-nowrap'>
        <div className='flex flex-wrap -m-1'>
          {oracle.priceFeeds.map(feed => {
            return (
              <div
                key={`${feed.token} - ${feed.currency}`}
                className='m-0.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-900'
              >
                {feed.token}/{feed.currency}
              </div>
            )
          })}
        </div>
      </td>

      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm text-gray-500'>{oracle.block.height}</div>
        <div className='text-sm text-gray-500'>
          {format(oracle.block.medianTime * 1000, 'MMM dd, hh:mm:ss aa')}
        </div>
      </td>
    </tr>
  )
}

function AddressBalance (props: { address: string }): JSX.Element {
  const [balance, setBalance] = useState('...')

  const api = useWhaleApiClient()
  void api.address.getBalance(props.address).then(value => {
    setBalance(value)
  })

  return (
    <>
      {balance}
    </>
  )
}
