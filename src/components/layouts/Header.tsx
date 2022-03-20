import { Container } from '@components/commons/Container'
import Link from 'next/link'
import { AppLogo } from '@components/icons/AppLogo'
import { HeaderNetworkMenu } from '@components/layouts/HeaderNetworkMenu'

const LINKS = [
  {
    title: 'ORACLES',
    path: '/'
  },
  {
    title: 'PRICES',
    path: '/prices'
  },
]

export function Header (): JSX.Element {
  return (
    <header className='bg-white'>
      <div className='border-b border-gray-100'>
        <Container className='py-3'>
          <div className='flex items-center justify-between'>
            <Link href={{ pathname: '/' }} passHref>
              <a className='flex items-center cursor-pointer hover:text-primary-500'>
                <AppLogo className='w-8 h-full' />
                <h6 className='ml-2 text-md font-semibold'>DeFiChain Oracles</h6>
              </a>
            </Link>

            <div className='flex items-center font-semibold text-gray-700 text-sm'>
              {LINKS.map(link => {
                return (
                  <Link href={{ pathname: link.path }} key={link.title} passHref>
                    <div className='hover:text-pink-500 cursor-pointer px-2'>{link.title}</div>
                  </Link>
                )
              })}
            </div>

            <div>
              <HeaderNetworkMenu />
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
