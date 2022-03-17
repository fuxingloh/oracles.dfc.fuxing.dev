import { Container } from '@components/commons/Container'
import Link from 'next/link'
import { DFCLogo } from '@components/icons/DFCLogo'
import { HeaderNetworkMenu } from '@components/layouts/HeaderNetworkMenu'

export function Header (): JSX.Element {
  return (
    <header className='bg-white'>
      <div className='border-b border-gray-100'>
        <Container className='py-3'>
          <div className='flex items-center justify-between'>
            <Link href={{ pathname: '/' }} passHref>
              <a className='flex items-center cursor-pointer hover:text-primary-500'>
                <DFCLogo className='w-8 h-full' />
                <h6 className='ml-1 text-md font-semibold'>DeFiChain Oracles</h6>
              </a>
            </Link>

            <div>
              <HeaderNetworkMenu />
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}
