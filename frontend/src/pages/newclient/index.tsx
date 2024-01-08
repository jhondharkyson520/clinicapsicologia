import Head from "next/head";
import { Header } from "@/components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "@/utils/canSSRAuth";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { setupAPIClient } from "@/services/api";
import InputMask from 'react-input-mask';
import { DateTime } from 'luxon';


export default function NewClient(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [dataV, setDataV] = useState('');
    const [valor, setValor] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [tipoPlano, setTipoPlano] = useState('');
    const [planoFamiliar, setPlanoFamiliar] = useState('');
    const [tipoPacote, setTipoPacote] = useState('');
    const [situacao, setSituacao] = useState(false);
    const [planoFamiliarDisabled, setPlanoFamiliarDisabled] = useState(true);
    const [dataVencimentoDisabled, setDataVencimentoDisabled] = useState(true);

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

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        
        try {
          if (
            name === '' || email === '' || cpf === '' || telefone === '' ||
            endereco === '' || valor === '' || quantidade === '' ||
            tipoPlano === '' || tipoPacote === ''
          ) {
            toast.error('Preencha todos os campos!');
            return;
          }
          
          const formattedDataVencimento = dataV && DateTime.fromFormat(dataV, 'dd/MM/yyyy').toISO();
    
          const data = new FormData();
    
          if (formattedDataVencimento && tipoPacote === 'Mensal') {
            data.append('dataVencimento', formattedDataVencimento);
          }
    
          const requestData = {
            name,
            email,
            cpf,
            telefone,
            endereco,
            tipoPlano,
            planoFamiliar,
            dataVencimento: formattedDataVencimento,
            valorPlano: parseFloat(valor),
            quantidadeSessoes: parseInt(quantidade, 10),
            situacao,
          };
    
          const apiClient = setupAPIClient();
          await apiClient.post('/client', requestData);
    
          toast.success('Cliente cadastrado com sucesso');
        } catch (err) {
          console.error(err);
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error('Erro ao cadastrar');
          }
        }
    
        setName('');
        setEmail('');
        setCpf('');
        setTelefone('');
        setDataV('');
        setValor('');
        setQuantidade('');
        setTipoPlano('');
        setPlanoFamiliar('');
        setTipoPacote('');
    }

    return(
        <>
        <Head>
            <title>Novo Cliente - SGCP</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>Novo Cliente</h1>

                <form className={styles.form} onSubmit={handleRegister}>
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

                        <select
                            id="planoFamiliar"
                            value={planoFamiliar}
                            onChange={(e) => setPlanoFamiliar(e.target.value)}
                            disabled={planoFamiliarDisabled}
                        >
                            <option value="" disabled hidden>Plano Familiar</option>
                            <option value="Dependente">Dependente</option>
                            <option value="Responsável">Responsável</option>
                        </select>

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

                    <InputMask 
                        mask="99/99/9999" 
                        placeholder="Data vencimento"
                        value={dataV}
                        onChange={(e) => setDataV(e.target.value)}
                        disabled={dataVencimentoDisabled}
                    />

                    <InputMask 
                        mask="R$ 9,99"
                        maskChar={null} 
                        placeholder="Valor plano"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}  
                    />

                    <input 
                        type="number"
                        placeholder="Quantidade de sessões"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}  
                    />

                    <button className={styles.buttonAdd} type="submit">
                        Cadastrar
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
