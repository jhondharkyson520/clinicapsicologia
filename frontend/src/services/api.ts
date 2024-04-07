import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './errors/AuthTokenError';
import { signOut } from '@/contexts/AuthContext';

export function setupAPIClient(ctx?:any ){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://15.229.5.211:3333',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    });

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response?.status === 401){
            if(typeof window !== undefined){
                signOut();
            }else {
                return Promise.reject(new AuthTokenError());
            }
        }

        return Promise.reject(error);

    })

    return api;
}