import Head from "next/head";
import { Header } from "@/components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "@/utils/canSSRAuth";
import { FormEvent, InputHTMLAttributes, ReactHTMLElement, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "@/services/api";
import InputMask from 'react-input-mask';
import { DateTime } from 'luxon';
import { useRouter } from "next/router";
import ptBR from 'date-fns/locale/pt-BR';
import DatePicker from 'react-datepicker';
import { useListOpen } from "@/providers/ListOpenContext";

interface Props {
  id: string;
}

export default function ClientEdit({ id }: Props){
  
    const [idClient, setIdClient] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [dataV, setDataV] = useState('');
    const [valor, setValor] = useState('');
    const [valorMask, setValorMask] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [tipoPlano, setTipoPlano] = useState('');
    const [planoFamiliar, setPlanoFamiliar] = useState('');
    const [tipoPacote, setTipoPacote] = useState('');
    const [situacao, setSituacao] = useState(false);

    const [planoFamiliarDisabled, setPlanoFamiliarDisabled] = useState(true);
    const [dataVencimentoDisabled, setDataVencimentoDisabled] = useState(true);

    const [camposFaltando, setCamposFaltando] = useState<string[]>([]);
    const router = useRouter();

    
    useEffect(() => {
      
      const clientId = router.query.id as string;
      setIdClient(clientId);
      //console.log(clientId);     
  
      const fetchClientData = async () => {
        try {
          const apiClient = setupAPIClient();
          const response = await apiClient(`/client/detail/${clientId}`);
          const clientData = response.data;
  
          setIdClient(clientId);        
          setName(clientData.name);
          setEmail(clientData.email);
          setCpf(clientData.cpf);
          setTelefone(clientData.telefone);
          setEndereco(clientData.endereco);
          setDataV(clientData.dataVencimento);
          setValorMask(clientData.valorPlano);
          setQuantidade(clientData.quantidadeSessoes);
          setTipoPlano(clientData.tipoPlano);
          setPlanoFamiliar(clientData.planoFamiliar);
          setTipoPacote(clientData.dataVencimento ? 'Mensal' : 'Sessões');
          setSituacao(clientData.situacao);
          
        } catch (error) {
          toast.error('Erro ao buscar dados do cliente');        
          
        }
      };
  
      fetchClientData();
    }, [router.query.id]);


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
      
      
      
      

    const handleTipoPacoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoPacote(e.target.value);
        setDataV('');
        setDataVencimentoDisabled(e.target.value !== 'Mensal');
    };

    const handleTipoPlanoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTipoPlano(e.target.value);
        setPlanoFamiliar('');
        setPlanoFamiliarDisabled(e.target.value !== 'Familiar');
    };

    const handleTeste = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPlanoFamiliar(e.target.value);
    };

   

    async function handleRegister(event: FormEvent) {
      event.preventDefault();
          
      const camposFaltando: string[] = [];

      if (name === '') camposFaltando.push('Nome');
      if (email === '') camposFaltando.push('Email');
      if (cpf === '') camposFaltando.push('CPF');
      if (telefone === '') camposFaltando.push('Telefone');
      if (endereco === '') camposFaltando.push('Endereço');
      if (valorMask === '') camposFaltando.push('Valor do Plano');
      if (quantidade === '') camposFaltando.push('Quantidade de Sessões');
      if (tipoPlano === '') camposFaltando.push('Tipo do Plano');
      if (tipoPacote === '') camposFaltando.push('Tipo do Pacote');
    
      if (camposFaltando.length > 0) {
        camposFaltando.forEach((campo) => {
          toast.error(`O campo '${campo}' é obrigatório.`);
        });
        return;
      }
    
      try {
        
        const dataVencimentoFormatted = selectedDate ? selectedDate.toLocaleDateString('pt-BR') : null;
        
          const requestData = {
          id: idClient, 
          name,
          email,
          cpf,
          telefone,
          endereco,
          tipoPlano,
          planoFamiliar,
          dataVencimento: dataVencimentoFormatted, 
          valorPlano: parseFloat(valor),
          quantidadeSessoes: parseInt(quantidade, 10),
          situacao,
        };
    
        const apiClient = setupAPIClient();
        const response = await apiClient.put(`/client/update/${idClient}`, requestData); 
        toast.success('Cliente atualizado com sucesso');
        router.push('/clientlist');

      } catch (error) {
        //console.log('Erro ao atualizar cliente:', error);
        toast.error('Erro ao atualizar cliente');
      }
    }

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    const handleDateChange = (date: Date | null) => {
      setSelectedDate(date);
    };

    useEffect(() => {
      setValor(valorMask);
    }, [selectedDate]);

    const { listOpen } = useListOpen();
  

    
    return(
        <>
        <Head>
            <title>Novo Cliente - SGCP</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>Editar dados do Cliente</h1>

                <form className={styles.form}  onSubmit={handleRegister}>
                      
                    
                      <input 
                          type="text"
                          placeholder="Nome"
                          value={name}
                          onChange={(e) => setName(e.target.value)} 
                      />
                      
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}  
                    />

                    <InputMask 
                        mask="999.999.999-99" 
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}  
                    />

                    <InputMask 
                        mask="(99) 99999-9999" 
                        placeholder="Telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}  
                    />

                    <input 
                        type="text"
                        placeholder="Endereço"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}  
                    />

                    <div className={styles.containerSelects}>
                        <select
                            id="tipoPlano"
                            value={tipoPlano}
                            onChange={handleTipoPlanoChange}
                        >
                            <option value="" disabled hidden>Tipo do Plano</option>
                            <option value="Individual">Individual</option>
                            <option value="Familiar">Familiar</option>
                        </select>

                        {tipoPlano === 'Individual' ? '' : 
                          <select
                              id="planoFamiliar"
                              value={planoFamiliar}
                              onChange={handleTeste}
                          >
                              <option value="" disabled hidden>Plano Familiar</option>
                              <option value="Dependente">Dependente</option>
                              <option value="Responsavel">Responsável</option>
                          </select> 
                        }

                        <select
                            id="tipoPacote"
                            value={tipoPacote}
                            onChange={handleTipoPacoteChange}
                        >
                            <option value="" disabled hidden>Tipo do Pacote</option>
                            <option value="Mensal">Mensal</option>
                            <option value="Sessões">Sessões</option>
                        </select>
                    </div>

                    {listOpen || tipoPacote === 'Sessões' ? <></> : 
                      
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Informe a data"
                          showYearDropdown
                          yearDropdownItemNumber={15}
                          scrollableYearDropdown
                          className={`${styles.datePicker} ${
                            isDatePickerOpen ? styles.datePickerOpen : ''
                          }`}
                          onFocus={() => setDatePickerOpen(true)}
                          onBlur={() => setDatePickerOpen(false)}
                          open={isDatePickerOpen}
                          locale="ptBR"
                        />
                                     
                    }                    

                    <input
                      placeholder="Valor plano"
                      value={valorMask}
                      onChange={handleValorChange}
                    />

                    <input 
                        type="number"
                        placeholder="Quantidade de sessões"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}  
                    />

                    <button className={styles.buttonAdd} type="submit">
                        Atualizar
                    </button>
                </form>
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
