import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../../utils/canSSRAuth";
import { RiDeleteBin6Line } from "react-icons/ri";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";

type AgendaItem = {
    id: string;
    name: string;
    dataConsulta: string;
    horarioConsulta: string;
    sessoesContador: number;
}

interface AgendaProps {
    clients: AgendaItem[];
}

export default function AgendaList({ clients }: AgendaProps) {
    const [clientList, setClientList] = useState(clients || []);
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        console.log('Dados recebidos:');
        clientList.forEach(client => {
            console.log('ID:', client.id, 'Nome:', client.name);
        });
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
        
        try {

          const apiClient = setupAPIClient(id);
          await apiClient.delete(`/agenda/${id}`);
    
          const updatedClientList = clientList.filter((client) => client.id !== id);
          setClientList(updatedClientList);
        } catch (error) {
          console.error("Erro ao excluir o cliente:", error);
          
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
                                        <td className={styles.tagCell}></td>
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
