import { api } from '@/services/apiClient';
import { Sign } from 'crypto';
import Router from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, ReactNode, useState, useEffect} from 'react';
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps ={
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut(){
    try{
      destroyCookie(undefined, '@nextauth.token')
      Router.push('/')
    }catch{
        toast.error('Erro ao deslogar');
        console.log('erro ao deslogar')
    }
  }

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | undefined>(undefined);
    const isAuthenticated = !!user;

    useEffect(() => {

        const { '@nextauth.token': token} = parseCookies();


        if(token){
            api.get('/me').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            }).catch(() => {

                signOut();
                
            })

        }


    }, [])

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            })
            //console.log(response.data);

            const {id, name, token} = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 160,
                path: '/'
            })

            setUser({
                id,
                name,
                email
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            toast.success('Logado com sucesso');
            Router.push('/dashboard');
            
        } catch (err) {
            toast.error('Erro ao acessar');
            console.log('Erro ao acessar', err)
        }
    }

    async function  signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            });
            
            toast.success('Usuário cadastrado com sucesso');
            console.log('Cadastrado com sucesso');
            Router.push('/signup');

            
        } catch (err) {
            toast.error('Email ou senha incorretos');
            console.log('Erro ao cadastrar ', err);
            
        }
    }

    return (
        <AuthContext.Provider value={{ user: user || ({} as UserProps), isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}
