import Head from "next/head";
import { Header } from "../..//components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../..//utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import router from "next/router";
import { HiUsers } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";


interface Client {
    id: string;
    name: string;
  }

export default function Caixa() {

    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");
    const [valorMask, setValorMask] = useState('');
    const [valor, setValor] = useState('');
    const [searchTerm, setSearchTerm] = useState('');


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

    const maskMoney = (value: string) => {
      
        const numericValue = value.replace(/\D/g, '');
        const formattedValue = numericValue.replace(/(\d)(\d{2})$/, '$1.$2');
        const valueWithDot = formattedValue.replace(/(?=(\d{3})+(\D))\B/g, '');
        return `R$ ${valueWithDot}`;
        
      };

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;       
       
 
        const numericValue = rawValue.replace(/[^\d,.]/g, '');  
        const valueWithDot = numericValue.replace(/,/g, '.');
        const formattedValueWithSymbol = maskMoney(valueWithDot);  
        const formattedValue = formattedValueWithSymbol.substring(2);

        setValor(formattedValue); 
        setValorMask(formattedValueWithSymbol);                   
      };

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
                                
                            <div className={styles.itemsForm}>
                                <span>Data: 26/01/2023</span>
                            </div>
                        
                            <div className={styles.itemsForm}>
                                <span>Valor do plano: </span>
                                <input 
                                    type="text"
                                    placeholder="Valor do Plano"
                                />
                            </div>

                            <div className={styles.itemsForm}>
                                <span>Valor em aberto: </span>
                                <input 
                                    type="text"
                                    placeholder="Valor em Aberto"
                                />
                            </div>

                            <div className={styles.itemsForm}>
                                <span>Situação: </span>
                                <input 
                                    type="text"
                                    placeholder="Situação"
                                />
                            </div>
                            
                            <div className={styles.itemsForm}>
                                <span>Valor pago: </span>
                                <input
                                placeholder="Valor pago"
                                value={valorMask}
                                onChange={handleValorChange}
                                />
                            </div>

                            <button className={styles.buttonConfirm} type="submit">
                                Confirmar
                            </button>
                                
                            <div className={styles.itemsForm}>
                                <span>Valor restante: R$:300,00</span>
                            </div>
                            <button className={styles.buttonConfirm} type="submit">
                                Marcar como pago
                            </button>                            
                        </form>
                    </div>


                    <div className={styles.containerHeader}>
                        <h1>$ Relatório Financeiro</h1>                        
                    </div>

                    <div className={styles.containerRelatorio}>
                        <div className={styles.tag}></div>

                        <div className={styles.formRelatorio}>
                            <div className={styles.relatorioItems}>                                            
                                <h1>Faturamento Mensal</h1>
                                <span>Total: R$ 5000,00</span>
                            </div>

                            <div className={styles.relatorioItems}>
                                <h1>Faturamento Anual</h1>                            
                                <span>Total: R$ 5000,00</span>
                            </div>


                            <div className={styles.relatorioItems}>
                                <h1>Pagamentos em Atraso</h1>                            
                                <span>Total: R$ 5000,00</span>
                            </div>
                        </div>

                        <h1>Pendências</h1>
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
                                    <th className={styles.tableCell}>Situação</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                                        <tr  className={styles.orderClient}>
                                            <td className={styles.tagCell}>
                                                <div className={styles.tag}></div>
                                            </td>
                                            <td className={`${styles.tableCell} ${styles.nameCell}`}>
                                                teste
                                            </td>                                       
                                            <td>
                                                R$ 500,00
                                            </td>
                                        </tr>
                                    
                            </tbody>
                        </table>


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

