import type { AppProps } from 'next/app'
 
import '../src/App.css';
import { Provider } from 'react-redux';
import mainStore from '../redux/main/mainStore';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Provider store={mainStore} > <Component {...pageProps} /></Provider>
}