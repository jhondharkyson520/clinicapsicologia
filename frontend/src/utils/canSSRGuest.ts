import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from 'next';
import { parseCookies } from 'nookies';

//função para paginas que só pode ser acessadas por visitantes

export function canSSRGuest<P extends { [key: string]: any; }> (fn: GetServerSideProps<P>){

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        // se o usuario tentar acessas a pagina porem tendo ja um login salvo redirecionamos
        if(cookies['@nextauth.token']){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(ctx);

    }

}