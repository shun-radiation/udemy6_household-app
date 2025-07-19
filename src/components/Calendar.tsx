import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import type { DatesSetArg, EventContentArg } from '@fullcalendar/core/index.js';
import '../calendar.css';
import type { Balance, CalendarContent, Transaction } from '../types';
import { calculationDailyBalances } from '../utils/financeCalculation';
import { formatCurrency } from '../utils/formatting';
import interactionPlugin, {
  type DateClickArg,
} from '@fullcalendar/interaction';

interface ClendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
}

const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
}: ClendarProps) => {
  // const events = [
  //   {
  //     title: 'Meeting',
  //     start: '2025-07-10',
  //     income: 300,
  //     expense: 200,
  //     balance: 100,
  //   },
  // ];

  // 月の取引データ
  // const monthlyTransactions = [
  //   {
  //     id: 'a',
  //     type: 'income',
  //     category: 'お小遣い',
  //     amount: 700,
  //     content: '母から',
  //     date: '2025-07-20',
  //   },
  //   {
  //     id: 'b',
  //     type: 'expense',
  //     category: '食費',
  //     amount: 200,
  //     content: '玉ねぎ',
  //     date: '2025-07-20',
  //   },
  //   {
  //     id: 'c',
  //     type: 'expense',
  //     category: '雑費',
  //     amount: 500,
  //     content: '時計',
  //     date: '2025-07-23',
  //   },
  // ];

  // 日付ごとの収支を計算する関数
  // const dailyBalances = {
  //   '2025-07-20': { income: 700, expense: 200, balance: 500 },
  //   '2025-07-23': { income: 0, expense: 500, balance: -500 },
  // };
  const dailyBalances = calculationDailyBalances(monthlyTransactions);
  // console.log(monthlyTransactions);
  // console.log(dailyBalances);

  // fullcalendar用のイベントを生成する関数
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };
  const calendarEvents = createCalendarEvents(dailyBalances);
  // console.log(calendarEvents);

  const renderEventContent = (eventInfo: EventContentArg) => {
    // console.log(eventInfo);
    // console.log(eventInfo.event.extendedProps.income);

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

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    // console.log(datesetInfo);
    setCurrentMonth(datesetInfo.view.currentStart);
  };

  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log(dateInfo);
    setCurrentDay(dateInfo.dateStr);
  };

  return (
    <div>
      <h1>Demo App</h1>
      <FullCalendar
        locale={jaLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        weekends={false}
        events={calendarEvents}
        eventContent={renderEventContent}
        datesSet={handleDateSet}
        dateClick={handleDateClick}
      />
    </div>
  );
};
export default Calendar;
