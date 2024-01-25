import Head from "next/head";
import { Header } from "../..//components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../..//utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import router from "next/router";
import { HiUsers } from "react-icons/hi2";


interface Client {
    id: string;
    name: string;
  }

export default function Caixa() {

    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");


    const fetchClients = async () => {
        try {
          const apiClient = setupAPIClient();
          const response = await apiClient.get("/clientlist");
          setClients(response.data);
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
        }
      };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleLancamento = async () =>{

    }

    return (
        <>
            <Head>
                <title>Clientes cadastrados - SGCP</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>

                    <div className={styles.containerHeader}>
                        <h1>$ Caixa</h1>                        
                    </div>

                    <div className={styles.containerCaixa}>
                        <div className={styles.tag}></div>
                        <form className={styles.formCaixa} onSubmit={handleLancamento}>
              
                            <div className={styles.selectClient}>
                                <HiUsers size={25} className={styles.iconsInput}/>
                                Nome do Cliente: 
                                <select
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                >
                                    <option value="">Selecione o cliente</option>
                                    {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                    </option>
                                    ))}
                                </select>  
                            </div>                          
                        </form>
                    </div>


                    <div className={styles.containerHeader}>
                        <h1>$ Relatório Financeiro</h1>                        
                    </div>

                    <div className={styles.containerCaixa}>
                        <div className={styles.tag}></div>
                        <div className={styles.formCaixa}>
                            <h1>Faturamentos</h1>
                        </div>
                    </div>                   
                   
                                       

                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return {
        props: {
        }
    };
});

