import './globals.css'
import {AppProps} from 'next/app';
import {useEffect, useState} from 'react';
import { wrapper } from '@/store/store';
import Head from 'next/head';

function App({Component, pageProps}: AppProps) {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  if (isServer) return null;

  return (
    <div suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/trendbox_icon.png" />
      </Head> 
      {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </div>
  );
}
export default wrapper.withRedux(App);