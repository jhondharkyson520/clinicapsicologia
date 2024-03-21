import styles from './styles.module.scss';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useListOpen } from '@/providers/ListOpenContext';

export function Header() {
  const { signOut } = useContext(AuthContext);
  const { listOpen, setListOpen } = useListOpen();

  const toggleList = () => {
    setListOpen(!listOpen);
  };

  const closeList = () => {
    setListOpen(false);
  };

  const closeListAndNavigate = () => {
    closeList();
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.menu}>
        <Link href="/dashboard">
          <img src="/logoHeader.svg" alt="logo" width={190} height={60} />
        </Link>

        <button className={styles.buttonBar} onClick={toggleList}>
          <FontAwesomeIcon className={styles.iconBars} icon={faBars} />
        </button>

        {listOpen && (
          <ul className={styles.list}>
            <button className={styles.buttonTimes} onClick={closeList}>
              <FontAwesomeIcon className={styles.iconTimes} icon={faTimes} />
            </button>
            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/dashboard" onClick={closeListAndNavigate}>
                Painel
              </a>
            </li>

            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/newclient" onClick={closeListAndNavigate}>
                Cadastrar Clientes
              </a>
            </li>

            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/clientlist" onClick={closeListAndNavigate}>
                Clientes
              </a>
            </li>

            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/agenda" onClick={closeListAndNavigate}>
                Agenda
              </a>
            </li>

            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/caixa" onClick={closeListAndNavigate}>
                Caixa
              </a>
            </li>

            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/config" onClick={closeListAndNavigate}>
                Configurações
              </a>
            </li>

            <li className={styles.lineLi}>
              <a className={styles.buttonH} href="/" onClick={signOut}>
                <FiLogOut size={24}/>
              </a>
            </li>            
            
          </ul>
        )}
      </div>

      <div className={styles.headerContent}>
        <Link href="/dashboard">
          <img src="/logoHeader.svg" alt="logo" width={190} height={60} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/dashboard" className={styles.a}>
            Painel
          </Link>
          <Link href="/newclient" className={styles.a}>
            Cadastrar Clientes
          </Link>
          <Link href="/clientlist" className={styles.a}>
            Clientes
          </Link>
          <Link href="/agenda" className={styles.a}>
            Agenda
          </Link>
          <Link href="/caixa" className={styles.a}>
            Caixa
          </Link>
          <Link href="/config" className={styles.a}>
            Configurações
          </Link>
          <button onClick={signOut}>
            <FiLogOut color="#000" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
