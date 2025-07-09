import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import type { EventContentArg } from '@fullcalendar/core/index.js';
import '../calendar.css';

const Calendar = () => {
  const events = [
    {
      title: 'Meeting',
      start: '2025-07-10',
      income: 300,
      expense: 200,
      balance: 100,
    },
  ];

  const renderEventContent = (eventInfo: EventContentArg) => {
    console.log(eventInfo);
    console.log(eventInfo.event.extendedProps.income);

    return (
      <div>
        <div className='money' id='event-income'>
          {eventInfo.event.extendedProps.income}
        </div>
        <div className='money' id='event-expense'>
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className='money' id='event-balance'>
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
        locale={jaLocale}
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={false}
        events={events}
        eventContent={renderEventContent}
      />
    </div>
  );
};
export default Calendar;
