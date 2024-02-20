import Head from "next/head";
import { Header } from "../..//components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../..//utils/canSSRAuth";
import { FiRefreshCcw, FiEdit2, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import ClientEdit from "../clientedit";
import Link from "next/link";
import router from "next/router";


type ListProps = {
    id: string;
    name: string;
    email: string;
    telefone: string;
    dataVencimento?: Date | null;
    tipoPlano: string;
    valorPlano: number | string;
    quantidadeSessoes?: number;
    situacao: boolean;
    sessoesContador: number;
}


interface ClientProps {
    clients: ListProps[];
}


export default function ClientList({ clients }: ClientProps) {

    const [clientList, setClientList] = useState(clients || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

   
    const formatDate = (date:any) => {
        return new Date(date).toLocaleDateString("pt-BR");
    };
  

    function handleOpenEdit(id: string) {
        router.push(`/clientedit?id=${id}`);
      }
      

    const handleDelete = async (id: string) => {
        
        try {

          const apiClient = setupAPIClient(id);
          await apiClient.delete(`/client/${id}`);
    
          const updatedClientList = clientList.filter((client) => client.id !== id);
          setClientList(updatedClientList);
        } catch (error) {
          console.error("Erro ao excluir o cliente:", error);
          
        }

      };

     
      

    return (
        <>
            <Head>
                <title>Clientes cadastrados - SGCP</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>

                    <div className={styles.containerHeader}>
                        <h1>Clientes cadastrados</h1>
                        <button>
                            <FiRefreshCcw size={25} color="#3FBAC2" />
                        </button>
                    </div>

                    <div className={styles.containerSearch}>
                        <input
                            type="text"
                            placeholder="Pesquisar cliente cadastrado"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}

                        />
                        <button>
                            <FiSearch size={25} color="#3FBAC2" />
                        </button>
                    </div>

                    <table className={styles.listClients}>
                        <thead>
                            <tr>
                                <th className={styles.tagCell}></th>
                                <th className={styles.tableCell}>Nome</th>
                                <th className={styles.tableCell}>Vencimento</th>
                                <th className={styles.tableCell}>Telefone</th>
                                <th className={styles.tableCell}>Sessões</th>
                                <th className={styles.tableCell}>Qtd. de sessões</th>
                                <th className={styles.tableCell}>Valor Plano</th>
                                <th className={styles.tableCell}>Situação</th>                                
                                <th className={styles.tableCell}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientList
                                .filter((client) =>
                                    client.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((client) => (
                                    <tr key={client.id} className={styles.orderClient}>
                                        <td className={styles.tagCell}>
                                            <div className={styles.tag}></div>
                                        </td>
                                        <td className={`${styles.tableCell} ${styles.nameCell}`}>
                                            {client.name.length > 10 ? `${client.name.slice(0, 10)}...` : client.name}
                                        </td>
                                        <td className={styles.tableCell} >
                                            {client.dataVencimento ? (
                                                formatDate(client.dataVencimento)
                                            ) : (
                                                
                                                <p style={{color: '#F13D49' }}>Plano por Sessões</p>
                                            )}
                                        </td>
                                        <td className={styles.disableCell}>{client.telefone}</td>
                                        <td className={styles.tableCell} >
                                            {client.quantidadeSessoes ? 
                                                (client.quantidadeSessoes)
                                             : (
                                                
                                                <p style={{color: '#F13D49' }}>Plano mensal</p>
                                            )}
                                        </td>
                                        <td className={styles.disableCell}>{client.sessoesContador}</td>

                                        <td className={styles.disableCell}>R${client.valorPlano}</td>
                                        <td>
                                            {client.situacao ? (
                                                <span className={styles.pagoText}>Pago</span>
                                            ) : (
                                                <span className={styles.vencidaText}>Vencida</span>
                                            )}
                                        </td>
                                        <td className={`${styles.tableCell} ${styles.buttonCell}`}>
                                            <button
                                                onClick={() => handleOpenEdit(client.id)}
                                                className={styles.buttonEdit}
                                            >
                                                Editar
                                                <FiEdit2 size={17} color="#3FFFA3" />
                                            </button>
                                            <button 
                                            className={styles.buttonDelete} 
                                            onClick={() => handleDelete(client.id)}>
                                                Excluir
                                                <RiDeleteBin6Line size={17} color="#F13D49" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                </main>
                {selectedClientId && <ClientEdit id={selectedClientId} />}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/clientlist');

    return {
        props: {
            clients: response.data
        }
    };
});

