import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi";
import { MdDateRange, MdCoPresent } from "react-icons/md";
import { SiCashapp } from "react-icons/si";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

interface Client {
  id: string;
  name: string;
  valorPlano: string;
  valorAberto: string;
  situacao: boolean;
}

interface Caixa {
  id: string;
  valorPlano: string;
  valorAberto: string;
  dataOperacao: Date;
  client_id: string;
}

export default function Caixa() {

  const [clients, setClients] = useState<Client[]>([]);
  const [caixa, setCaixa] = useState<Caixa[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCaixa, setSelectedCaixa] = useState<Caixa | null>(null);
  const [valorMask, setValorMask] = useState('');
  const [valor, setValor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [valorEmAberto, setValorEmAberto] = useState('R$ 0,00');


  const calcularValorEmAberto = async (clientId: string) => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/caixa/latest/${clientId}`);
      const latestCaixa = response.data;
      if (latestCaixa) {
        const valorAberto = latestCaixa.valorAberto.toString();
        setValorEmAberto(`R$ ${valorAberto}`);
      } else {
        setValorEmAberto('R$ 0.00');
      }
    } catch (error) {
      console.error("Erro ao buscar o valor em aberto:", error);
    }
  };
  

  const fetchClients = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/clientlist");
      setClients(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const fetchCaixa = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/caixalist");

      setCaixa(response.data);
    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error);
    }
  };

  

  const fetchClientDetails = async (clientId: string) => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/client/detail/${clientId}`);
      const clientDetails = response.data;

      if (parseFloat(clientDetails.valorAberto) <= 0) {
        clientDetails.situacao = true; 
      }

      setSelectedClient(clientDetails);
      calcularValorEmAberto(clientId);
    } catch (error) {
      console.error("Erro ao buscar detalhes do cliente:", error);
    }
  };

  useEffect(() => {
    fetchCaixa();
  }, []);

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

  const handleLancamento = async () => {
    try {
      if (!selectedClientId || valor === '') {
        console.error('Cliente ou valor não selecionado');
        toast.warning('Preencha todos os campos!')
        return;
      }
  
      const apiClient = setupAPIClient();
  
      const response = await apiClient.post('/lancamento', {
        client_id: selectedClientId,
        valorPago: parseFloat(valor),
      });

      console.log('Resposta da API:', response.data);

      console.log('Lançamento bem-sucedido!');
      toast.success('Lançamento bem-sucedido!');

      setSelectedClientId('');
      setSelectedClient(null);
      setValorEmAberto('');
      setValorMask('');
    } catch (error) {
      console.error('Erro ao realizar o lançamento:', error);
      toast.error('Erro ao realizar o lançamento');
    }
  };
  
  

  const formatarDataAtual = () => {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    return `${dia}/${mes}/${ano}`;
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
            <h1>$ Caixa</h1>
          </div>

          <div className={styles.containerCaixa}>
            <div className={styles.tag}></div>
            <form className={styles.formCaixa} onSubmit={(e) => e.preventDefault()}>

              <div className={styles.selectClient}>
                <HiUsers size={25} className={styles.iconsInput} />
                Nome do Cliente:
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    fetchClientDetails(e.target.value);
                  }}
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
                <MdDateRange size={25} className={styles.iconsInput} />
                <span>Data atual: <strong>{formatarDataAtual()}</strong></span>
              </div>

              <div className={styles.itemsForm}>
                <SiCashapp size={25} className={styles.iconsInput} />
                <span>Valor do plano: </span>
                <input
                  type="text"
                  placeholder="Valor do Plano"
                  className={styles.inputContainerDisable}
                  value={selectedClient ?  `R$ ${selectedClient.valorPlano|| '0.00'}` : 'R$ 0,00'}
                  readOnly
                />
              </div>

              <div className={styles.itemsForm}>
                <SiCashapp size={25} className={styles.iconsInput} />
                <span>Valor em aberto: </span>
                <input
                  type="text"
                  placeholder="Valor em Aberto"
                  className={styles.inputContainerDisable}
                  value={valorEmAberto}
                  readOnly
                />
              </div>

              <div className={styles.itemsForm}>
                <MdCoPresent size={25} className={styles.iconsInput} />
                <span>Situação: </span>
                <input
                  type="text"
                  placeholder="Situação"
                  className={styles.inputContainerDisable}
                  value={selectedClient ? (selectedClient.situacao ? "Pago" : "Em aberto") : ""}
                  readOnly
                />
              </div>

              <div className={styles.itemsForm}>
                <SiCashapp size={25} className={styles.iconsInput} />
                <span>Valor pago: </span>
                <input
                  placeholder="Valor pago"
                  value={valorMask}
                  onChange={handleValorChange}
                  className={styles.inputContainer}
                />
              </div>

            <div className={styles.itemsForm}>
                <span>Valor restante: <strong>{selectedClient ? `R$ ${parseFloat(selectedClient.valorPlano) - parseFloat(valor)}` : 'R$ 0,00'}</strong></span>
            </div>

            <button className={styles.buttonConfirm} type="button"  onClick={handleLancamento} >
                Marcar como pago
            </button>
            </form>
          </div>

        </main>
      </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  };
});
