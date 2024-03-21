import '.././styles/globals.scss'
import { AppProps } from "next/app"
import { AuthProvider } from '../contexts/AuthContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';
import { ListOpenProvider } from '@/providers/ListOpenContext';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ListOpenProvider>
        <Component {...pageProps}/>
        <ToastContainer autoClose={3000}/>
      </ListOpenProvider>
       
    </AuthProvider>
    
  )
}

export default MyApp