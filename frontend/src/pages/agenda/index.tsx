

import Head from "next/head";
import { Header } from "../..//components/Header";
import styles from './styles.module.scss';
import { canSSRAuth } from "../..//utils/canSSRAuth";
import { useState, useEffect } from "react";
import { setupAPIClient } from "@/services/api";
import { useRouter } from "next/router";
import InputMask from 'react-input-mask';
import { DateTime } from 'luxon';
import { HiOutlineCalendar, HiOutlineClock, HiUsers } from "react-icons/hi2";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';




interface Agenda{
  id: string;
  name: string;
  dataConsulta: Date;
  horarioConsulta: Date;
}

interface Client {
  id: string;
  name: string;
}

export default function Agenda() {
  const [clients, setClients] = useState<Client[]>([]);
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  console.log(events);
  
  useEffect(() => {
    // Carregue a lista de clientes ao montar o componente
    fetchClients();
  }, []);

  useEffect(() => {
    fetchAgendaList();
  }, [selectedDate, selectedTime]);

  const fetchClients = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/clientlist");
      setClients(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const fetchAgendaList = async () => {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/agendalist");
  
      console.log("Resposta do servidor:", response.data);
  
      const formattedEvents = response.data.map((agendaItem: any) => {
        console.log("Data e Hora Consulta:", agendaItem.dataConsulta, agendaItem.horarioConsulta);
  
        // Convertendo data para objeto DateTime
        const dataConsulta = DateTime.fromFormat(agendaItem.dataConsulta, 'dd/MM/yyyy');
  
        // Separando horas e minutos
        const [hour, minute] = agendaItem.horarioConsulta.split(':');
  
        // Criando objeto Date com ano, mês, dia, hora e minuto
        const horarioConsulta = new Date(
          dataConsulta.year,
          dataConsulta.month - 1, // Mês no JavaScript é baseado em zero
          dataConsulta.day,
          parseInt(hour),
          parseInt(minute)
        );
  
        // Formatando manualmente a hora com minutos
        const horaFormatada = `${hour}:${minute.padStart(2, '0')}`;
  
        // Combinando duas informações no título
        const title = `${horaFormatada}  -  ${agendaItem.client.name}`;
  
        return {
          title,
          description: horaFormatada,
          start: horarioConsulta.toISOString(),
        };
      });
  
      console.log("Eventos formatados:", formattedEvents);
  
      setEvents(formattedEvents);
      setAgenda(response.data);
    } catch (error) {
      console.error("Erro ao buscar agendas:", error);
    }
  };
  
  
  
  
  

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleAgendamento = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const apiClient = setupAPIClient();
  
      if (!selectedClientId) {
        console.error('Selecione um cliente antes de agendar.');
        return;
      }

      const dataHoraLuxon = DateTime.fromFormat(`${selectedDate} ${selectedTime}`, 'dd/MM/yyyy HH:mm', { zone: 'UTC' });

      const horaAtual = DateTime.now();
      
     console.log(dataHoraLuxon);
     console.log(horaAtual);
      

    
     if(dataHoraLuxon <= horaAtual)
     {
      console.log('não é possivel fazer agendamentos passados');      
      return;
     }
     
     
  
      
      const agendamentoData = {
        dataConsulta: selectedDate,
        horarioConsulta: selectedTime,
        client_id: selectedClientId,
        sessoesContador: 1,
      };
      console.log(agendamentoData);
      
  
      const response = await apiClient.post("/agenda", agendamentoData);
      
      
      setSelectedDate('');
      setSelectedTime('');
  
      console.log("Agendamento bem-sucedido:", response.data);
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };

  function renderEventContent(eventInfo:any) {
    return (
      <>
        <b>{eventInfo.event.title}</b>
      </>
    )
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
            <h1>Agenda</h1>
          </div>
          
            <form className={styles.form} onSubmit={handleAgendamento}>
              
            <div className={styles.selectClient}>
              <HiUsers size={25} className={styles.iconsInput}/>
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
              
            <div className={styles.inputDateHour}>
              <HiOutlineCalendar size={25} className={styles.iconsInputCalendar}/>
                <InputMask
                  mask="99/99/9999"
                  placeholder="Informe a data"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
                
                
              <HiOutlineClock size={25} className={styles.iconsInputClock}/>
                <InputMask
                  mask="99:99"
                  placeholder="Informe o horário"
                  value={selectedTime}
                  onChange={handleTimeChange}
                />
            </div>

              <button className={styles.buttonAdd} type="submit">
                Agendar
              </button>
            </form>

            <div>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridWeek'
                weekends={true}
                events={events}
                eventContent={renderEventContent}
                locales={[ptBrLocale]}
              />
            </div>

        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
