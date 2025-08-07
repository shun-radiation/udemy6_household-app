import { Box, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';
import { addMonths } from 'date-fns';

interface MonthSelectorProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
  setPage,
}: MonthSelectorProps) => {
  const handleDateChange = (newDate: Date | null) => {
    console.log(newDate);
    if (newDate) {
      setCurrentMonth(newDate);
    }
  };
  // 先月ボタン
  const handlePreviosMonth = () => {
    const previosMonth = addMonths(currentMonth, -1);
    // console.log(previosMonth);
    setCurrentMonth(previosMonth);
    setPage(0);
  };
  //次月ボタン
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    // console.log(nextMonth);
    setCurrentMonth(nextMonth);
    setPage(0);
  };

  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={ja}
        // dateFormats={{ monthAndYear: 'yyyy年 MM月' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            color={'error'}
            variant='contained'
            onClick={handlePreviosMonth}
          >
            先月
          </Button>
          <DatePicker
            label={'年月を選択'}
            sx={{ mx: 2, background: 'white' }}
            value={currentMonth}
            onChange={handleDateChange}
            views={['year', 'month']}
            format='yyyy/MM'
            // slotProps={{
            //   toolbar: { toolbarFormat: 'yyyy年MM月' },
            // }}
            slotProps={{
              calendarHeader: { format: 'yyyy年 MM月' },
              popper: {
                sx: {
                  '& .MuiYearCalendar-root > button': {
                    height: '100%',
                  },
                  '& .MuiMonthCalendar-root': {
                    display: 'grid',
                    columnGap: '10px',
                    rowGap: '20px',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                  },
                  '& .MuiMonthCalendar-root > button': {
                    height: '100%',
                    mx: 'auto',
                    px: 0,
                    py: 1,
                  },
                },
              },
            }}
          />
          <Button
            color={'primary'}
            variant='contained'
            onClick={handleNextMonth}
          >
            次月
          </Button>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default MonthSelector;
