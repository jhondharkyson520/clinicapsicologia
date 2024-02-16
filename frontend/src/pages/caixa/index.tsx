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
  const [valorPlano, setValorPlano] = useState<Number>();
  const [valorRestante, setValorRestante] = useState('');


   
  


 


  const getSaldoStatus = (valorAberto: string) => {
    const saldo = parseFloat(valorAberto);
    if (saldo > 0) {
      return { status: 'Saldo positivo', situacao: true };
    } else if (saldo < 0) {
      return { status: 'Saldo devedor', situacao: false };
    }
    return { status: '', situacao: false };
  };
  
  
  const calcularValorEmAberto = async (clientId: string) => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get(`/caixa/latest/${clientId}`);
      const latestCaixa = response.data;
      
      if (latestCaixa) {
        let valorAberto = parseFloat(latestCaixa.valorAberto);
  
        if (valorAberto > 0) {
          valorAberto *= -1;
        } else if (valorAberto < 0) {
          valorAberto *= -1;
        }
        
        setValorEmAberto(`R$ ${valorAberto.toFixed(2)}`);
        
        const { situacao } = getSaldoStatus(valorAberto.toString());
        
        setSelectedClient({ ...selectedClient!, situacao, id: clientId, valorPlano: latestCaixa.valorPlano });
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

      console.log("Detalhes do cliente:", clientDetails);

      const valorAberto = parseFloat(clientDetails.valorAberto);
      const valorPlanoFloat = parseFloat(clientDetails.valorPlano); // Convertendo para float
      const situacaoCliente = isNaN(valorAberto) ? false : valorAberto > 0 ? false : true;

      setSelectedClient({ ...clientDetails, situacao: situacaoCliente, valorPlano: valorPlanoFloat.toFixed(2) }); // Aplicando a formatação

      console.log("valor plano fim ", valorPlanoFloat.toFixed(2));

      setValorPlano(valorPlanoFloat);


      // restante retornando 000, verificar
      
    const valorRestante = valorEmAberto.replace(/[^\d.-]/g, '');
    setValorRestante(valorRestante);
    console.log('valor restante: ', valorRestante);
    
      

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
  
  useEffect(() => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId);
    }
  }, [selectedClientId]); 
  
  useEffect(() => {
    if (selectedClient) {
      console.log("valor plano fim2 ", selectedClient.valorPlano);
    }
  }, [selectedClient]); 
  

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
  
      const situacaoCliente = valorEmAberto.includes('-') ? false : true;
      const updateResponse = await apiClient.put(`/client/update/${selectedClientId}`, {
        situacao: situacaoCliente,
      });
  
      console.log('Resposta do update do cliente:', updateResponse.data);
  
      setSelectedClientId('');
      setSelectedClient(null);
      setValorEmAberto('');
      setValorMask('');
      setSelectedClient({
        id: '',
        name: '',
        valorPlano: '0.00',
        valorAberto: '0.00',
        situacao: false
      });
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


  const textoSituacao = () => {
    const valorAbertoString = valorEmAberto.replace(/[^\d.-]/g, ''); // Remover todos os caracteres não numéricos
    let valorAberto = parseFloat(valorAbertoString); // Converter para float ou usar 0 se a conversão falhar
    console.log(valorAberto);
  
    const situacao = valorAberto > 0 ? 'Pago' : 'Vencido';
    return situacao;
  };
  
  console.log("ValorEmAberto:", valorRestante);
console.log("Valor:", valor);

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
                  value={selectedClient ? `R$ ${(valorPlano?.toFixed(2))}` : 'R$ 0,00'}
                  readOnly
                />
              </div>

              <div className={styles.itemsForm}>
                <SiCashapp size={25} className={styles.iconsInput} />
                <span>Saldo do cliente: </span>
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
                  value={textoSituacao()}
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
              <span>Valor restante: <strong>{selectedClient ? `R$ ${(parseFloat(valorRestante) || 0) - (parseFloat(valor) || 0)}` : 'R$ 0,00'}</strong></span>

              </div>

              <button className={styles.buttonConfirm} type="button" onClick={handleLancamento}>
                {selectedClient && selectedClient.situacao ? 'Pago' : 'Marcar como pago'}
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
