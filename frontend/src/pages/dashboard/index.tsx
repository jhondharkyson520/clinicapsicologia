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
import { toast } from "react-toastify";


type AgendaItem = {
    id: string;
    name: string;
    dataConsulta: string;
    horarioConsulta: string;
    sessoesContador: number;
}

interface ClientProps {
    clients: AgendaItem[];
}

export default function AgendaList({ clients }: ClientProps) {
    const [clientList, setClientList] = useState(clients || []);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        console.log('Dados recebidos:', clientList);
    }, [clientList]);

    const formatDate = (date: string) => {
        try {
            const [day, month, year] = date.split('/');
            const formattedDate = `${day.padStart(2, '0')} de ${getMonthName(month)} de ${year}`;
            console.log('Data formatada:', formattedDate);
            return formattedDate;
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };
    
    const getMonthName = (month: string) => {
        const months = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        const monthIndex = parseInt(month, 10) - 1;
        return months[monthIndex];
    };
    
    const handleDelete = async (id: string) => {
        console.log("Tentando excluir agendamento com o ID:", id);
        
        try {
          const apiClient = setupAPIClient(); 
          await apiClient.delete(`/agenda/${id}`);
          
          console.log("Agendamento excluído com sucesso:", id);
          
          const updatedClientList = clientList.filter((client) => client.id !== id);
          setClientList(updatedClientList);
        } catch (error) {
          console.error("Erro ao excluir agendamento:", error);
        }
      };
      

    return (
        <>
            <Head>
                <title>Próximas sessões - SGCP</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Próximas sessões</h1>
                        <button>
                            <FiRefreshCcw size={25} color="#3FBAC2" />
                        </button>
                    </div>
                    <table className={styles.listClients}>
                        <thead>
                            <tr>
                                <th className={styles.tagCell}></th>
                                <th className={styles.tableCell}>Nome</th>
                                <th className={styles.tableCell}>Data consulta</th>
                                <th className={styles.tableCell}>Horário consulta</th>
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
                                        <td className={styles.tableCell}>
                                            {formatDate(client.dataConsulta)}
                                        </td>
                                        <td className={styles.tableCell}>
                                            {client.horarioConsulta}
                                        </td>
                                        <td className={`${styles.tableCell} ${styles.buttonCell}`}>
                                            <button 
                                                className={styles.buttonDelete} 
                                                onClick={() => handleDelete(client.id)}
                                            >
                                                Excluir
                                                <RiDeleteBin6Line size={17} color="#F13D49" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/agenda/proximas');

    return {
        props: {
            clients: response.data
        }
    };
});
