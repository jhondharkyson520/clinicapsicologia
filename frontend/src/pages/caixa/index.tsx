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

interface Client {
  id: string;
  name: string;
  valorPlano: string;
  valorAberto: string;
  situacao: boolean;
}

export default function Caixa() {

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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

  const fetchClientDetails = async (clientId: string) => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/client/detail/${clientId}`);
      const clientDetails = response.data;

      setSelectedClient(clientDetails);
    } catch (error) {
      console.error("Erro ao buscar detalhes do cliente:", error);
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

  const handleLancamento = async () => {
    try {
      if (!selectedClientId || valor === '') {
        console.error('Cliente ou valor não selecionado');
        return;
      }
  
      const apiClient = setupAPIClient();
  
      const response = await apiClient.post('/lancamento', {
        client_id: selectedClientId,
        valorPago: parseFloat(valor),
      });
  
      // A resposta da API pode conter informações adicionais que você deseja processar
      console.log('Resposta da API:', response.data);
  
      // Adicione aqui qualquer lógica adicional após o lançamento bem-sucedido
  
      console.log('Lançamento bem-sucedido!');
    } catch (error) {
      console.error('Erro ao realizar o lançamento:', error);
    }
  };
  
  const handleMarcarComoPago = async () => {
    try {
      if (!selectedClientId || valor === '') {
        console.error('Cliente ou valor não selecionado');
        return;
      }
  
      const apiClient = setupAPIClient();
  
      // Busca o cliente na API para obter o valor mais recente
      const responseClient = await apiClient.get(`/client/detail/${selectedClientId}`);
      const updatedClient = responseClient.data;
  
      // Calcula o valor restante
      const valorRestante = updatedClient
        ? parseFloat(updatedClient.valorPlano) - parseFloat(valor)
        : 0;
  
      // Atualiza o valorAberto na API
      const response = await apiClient.put(`/client/update/${selectedClientId}`, {
        valorAberto: valorRestante.toString(),
      });
  
      // A resposta da API pode conter informações adicionais que você deseja processar
      console.log('Resposta da API (Marcar como pago):', response.data);
  
      // Adicione aqui qualquer lógica adicional após marcar como pago com sucesso
  
      console.log('Marcação como pago bem-sucedida!');
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
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
                <span>Data: <strong>26/01/2023</strong></span>
              </div>

              <div className={styles.itemsForm}>
                <SiCashapp size={25} className={styles.iconsInput} />
                <span>Valor do plano: </span>
                <input
                  type="text"
                  placeholder="Valor do Plano"
                  className={styles.inputContainerDisable}
                  value={selectedClient ? selectedClient.valorPlano : ""}
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
    value={selectedClient ? `R$ ${selectedClient.valorAberto || '0.00'}` : 'R$ 0,00'}
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

              <button className={styles.buttonConfirm} type="button" onClick={handleLancamento}>
                Confirmar
            </button>

            <div className={styles.itemsForm}>
                <span>Valor restante: {selectedClient ? `R$ ${parseFloat(selectedClient.valorPlano) - parseFloat(valor)}` : 'R$ 0,00'}</span>
            </div>

            <button className={styles.buttonConfirm} type="button" onClick={handleMarcarComoPago}>
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
