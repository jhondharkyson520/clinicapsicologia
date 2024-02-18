import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../../utils/canSSRAuth";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; // Importe AxiosError para lidar com erros específicos do Axios
import { HiUsers } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { setupAPIClient } from "@/services/api";

interface User {
  id: string;
  email: string;
}

export default function Config() { 


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    console.log("Form submitted:", name, email, password); // Adiciona um log dos dados submetidos

    const camposFaltando: string[] = [];

    if (name === '') camposFaltando.push('Nome');
    if (email === '') camposFaltando.push('Email');
    if (password === '') camposFaltando.push('Senha');
 
    if (camposFaltando.length > 0) {
      camposFaltando.forEach((campo) => {
        toast.warning(`O campo '${campo}' é obrigatório.`);
      });
      return;
    }
    
    try {               
      const requestData = {
        name,
        email,
        password
      };

      const apiClient = setupAPIClient();
      const response = await apiClient.post('/users', requestData);

      toast.success('Usuário cadastrado com sucesso');
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.status === 400) {
        toast.error('Email já cadastrado');
      } else {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error('Erro ao cadastrar');
        }
      }
    }
    setName('');
    setEmail('');
    setPassword('');
  }
  
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/userlist');
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error('Erro ao buscar usuários');
      }
    }

    fetchUsers();
  }, []);

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();

    if (!selectedUser) {
      toast.error('Selecione um usuário.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      const requestData = {
        userId: selectedUser,
        newPassword
      };

      const apiClient = setupAPIClient();
      await apiClient.put(`/users/${selectedUser}/password`, requestData);

      toast.success('Senha alterada com sucesso');
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      toast.error('Erro ao alterar a senha');
    }
    
    setSelectedUser('');
    setNewPassword('');
    setConfirmNewPassword('');
  }


  return (
    <>
      <Head>
        <title>Configurações - SGCP</title>
      </Head>
      <div>
        <Header />
        <main className={styles.container}>        
          <div className={styles.containerCaixa}>
            <div className={styles.tag}></div>
            <form className={styles.formCaixa} onSubmit={handleSubmit}>
              <div className={styles.containerHeader}>
                <h1>Cadastrar Usuário</h1>
              </div>
              <div className={styles.selectClient}>
                <HiUsers size={25} className={styles.iconsInput} />
                Nome do Usuário:
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  className={styles.inputContainer}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />                
              </div>
              <div className={styles.selectClient}>
                <MdEmail size={25} className={styles.iconsInput} />
                Email do Usuário:
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={styles.inputContainer}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />                
              </div>
              <div className={styles.selectClient}>
                <RiLockPasswordFill size={25} className={styles.iconsInput} />
                Senha do Usuário:
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className={styles.inputContainer}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />                
              </div>           
              <button className={styles.buttonConfirm} type="submit">
                Cadastrar
              </button>
            </form>



           <form className={styles.formCaixa} onSubmit={handleUpdate}>
              <div className={styles.containerHeader}>
                <h1>Alterar senha</h1>
              </div>
              <div className={styles.selectClient}>
                <MdEmail size={25} className={styles.iconsInput} />
                Email do Usuário:
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Selecione o email</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selectClient}>
                <RiLockPasswordFill size={25} className={styles.iconsInput} />
                Nova senha:
                <input
                  type="password"
                  placeholder="Digite sua nova senha"
                  className={styles.inputContainer}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />                
              </div>
              <div className={styles.selectClient}>
                <RiLockPasswordFill size={25} className={styles.iconsInput} />
                Confirme a nova senha:
                <input
                  type="password"
                  placeholder="Confirme sua nova senha"
                  className={styles.inputContainer}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />                
              </div>           
              <button className={styles.buttonConfirm} type="submit">
                Alterar
              </button>
            </form>


          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

  return {
      props: {}
  }
})