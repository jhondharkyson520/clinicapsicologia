

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
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from "react-icons/fa";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';




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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentView, setCurrentView] = useState<string>('dayGridDay'); 
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  console.log(events);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };
  
  useEffect(() => {
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
  
  
  
  
  

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
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
     
     
     const formattedDate = selectedDate ? selectedDate.toLocaleDateString('pt-BR') : '';

      
     const agendamentoData = {
      dataConsulta: formattedDate,
      horarioConsulta: selectedTime,
      client_id: selectedClientId,
      sessoesContador: 1,
    };
      console.log(agendamentoData);
      
  
      const response = await apiClient.post("/agenda", agendamentoData);
      
      
      setSelectedTime('');
      setClients([]);
      setSelectedDate(null);
  
      console.log("Agendamento bem-sucedido:", response.data);
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function renderEventContent(eventInfo:any) {
    const { title } = eventInfo.event;

  // Estilização personalizada para cada evento
  const eventStyle: React.CSSProperties = {
    padding: '8px',
    backgroundColor: getRandomColor(), // Use a função para obter uma cor aleatória
    color: '#fff', // Cor do texto
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex'
  };

  return (
    <div style={eventStyle}>
      <b>{title}</b>
    </div>
  );
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
            <h1>Realizar agendamentos</h1>
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
              
              <div className={styles.datePickerContainer}>
              <HiOutlineCalendar size={25} className={styles.iconsInputCalendar}/>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => handleDateChange(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Informe a data"
                  showYearDropdown
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                  className={`${styles.datePicker} ${isDatePickerOpen ? styles.datePickerOpen : ''}`}
                  onFocus={() => setDatePickerOpen(true)}
                  onBlur={() => setDatePickerOpen(false)}
                  open={isDatePickerOpen}
                  locale={ptBR}
                />
              </div>
                
                
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

            <div className={styles.containerCalendar}>
              <h1>Calendário</h1>
            </div>
            <div className={styles.viewCalendar}>
            <div className={styles.viewButtons}>

            
              <button
                className={currentView === 'dayGridDay' ? styles.activeView : ''}
                onClick={() => handleViewChange('dayGridDay')}
              >
                {<FaCalendarDay />}
                Dia
              </button>
              <button
                className={currentView === 'dayGridWeek' ? styles.activeView : ''}
                onClick={() => handleViewChange('dayGridWeek')}
              >
                {<FaCalendarWeek />}
                Semana
              </button>
              <button
                className={currentView === 'dayGridMonth' ? styles.activeView : ''}
                onClick={() => handleViewChange('dayGridMonth')}
              >
                {<FaCalendarAlt />}
                Mês
              </button>
            </div>

            <div>
              {currentView === 'dayGridDay' && (
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView='dayGridDay'
                  weekends={true}
                  events={events}
                  eventContent={renderEventContent}
                  locales={[ptBrLocale]}
                />
              )}

              {currentView === 'dayGridWeek' && (
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView='dayGridWeek'
                  weekends={true}
                  events={events}
                  eventContent={renderEventContent}
                  locales={[ptBrLocale]}
                />
              )}

              {currentView === 'dayGridMonth' && (
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView='dayGridMonth'
                  weekends={true}
                  events={events}
                  eventContent={renderEventContent}
                  locales={[ptBrLocale]}
                />
              )}
            </div>            
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
