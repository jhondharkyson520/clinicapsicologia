import Head from "next/head";
import { Header } from "../../components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi";
import { MdDateRange, MdCoPresent, MdEmail } from "react-icons/md";
import { SiCashapp } from "react-icons/si";
import { toast } from "react-toastify";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";
import { TbPasswordUser } from "react-icons/tb";


export default function Config() {  

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

            
            <form className={styles.formCaixa} onSubmit={(e) => e.preventDefault()}>

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
                />                
              </div>

              <div className={styles.selectClient}>
                <MdEmail size={25} className={styles.iconsInput} />
                Email do Usuário:
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={styles.inputContainer}
                />                
              </div>

              <div className={styles.selectClient}>
                <RiLockPasswordFill size={25} className={styles.iconsInput} />
                Senha do Usuário:
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className={styles.inputContainer}
                />                
              </div>           

              <button className={styles.buttonConfirm} type="button">
                Cadastrar
              </button>
            </form>

            <form className={styles.formCaixa} onSubmit={(e) => e.preventDefault()}>
              
              <div className={styles.containerHeader}>
                <h1>Alterar senha</h1>
              </div>
  
              <div className={styles.selectClient}>
                <MdEmail size={25} className={styles.iconsInput} />
                Email do Usuário:
                <select        
                >
                  <option value="">Selecione o email</option>
                  
                    <option>
                      email@teste.com
                    </option>
                </select>
              </div>
  
                <div className={styles.selectClient}>
                  <RiLockPasswordFill size={25} className={styles.iconsInput} />
                  Sua nova senha:
                  <input
                    type="password"
                    placeholder="Digite sua nova senha"
                    className={styles.inputContainer}
                  />                
                </div>
  
                <div className={styles.selectClient}>
                  <RiLockPasswordFill size={25} className={styles.iconsInput} />
                  Confirme sua senha:
                  <input
                    type="password"
                    placeholder="Confirme sua nova senha"
                    className={styles.inputContainer}
                  />                
                </div>           
  
                <button className={styles.buttonConfirm} type="button">
                  Alterar
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
