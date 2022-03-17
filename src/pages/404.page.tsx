import Head from 'next/head'
import { Container } from '@components/commons/Container'

export default function NotFound (): JSX.Element {
  return (
    <>
      <Head>
        <title>Page Not Found - DeFiChain Oracles</title>
      </Head>

      <Container className='py-10'>
        <h1 className='text-3xl font-semibold'>
          404 - Page Not Found
        </h1>
      </Container>
    </>
  )
}
