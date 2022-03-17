import Head from 'next/head'
import { PropsWithChildren } from 'react'
import { Header } from './Header'
import { NetworkProvider } from '@components/contexts/NetworkContext'
import { WhaleProvider } from '@components/contexts/WhaleContext'

export function Default (props: PropsWithChildren<{}>): JSX.Element | null {
  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <meta charSet='UTF-8' />

        <title key='title'>DeFiChain Oracles</title>
        <meta key='robots' name='robots' content='follow,index' />
        <meta key='viewport' name='viewport' content='user-scalable=no, width=device-width, initial-scale=1' />
        <meta key='apple-mobile-web-app-capable' name='apple-mobile-web-app-capable' content='yes' />

        <link rel='icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='48x48' href='/favicon.png' />
      </Head>

      <NetworkProvider>
        <WhaleProvider>
          <Header />

          <main className='flex-grow'>
            {props.children}
          </main>
        </WhaleProvider>
      </NetworkProvider>
    </div>
  )
}
