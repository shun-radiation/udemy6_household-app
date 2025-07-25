import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrainIcon from '@mui/icons-material/Train';
import WorkIcon from '@mui/icons-material/Work';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SavingsIcon from '@mui/icons-material/Savings';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, type JSX } from 'react';
import type { ExpenseCategory, IncomeCategory, Transaction } from '../types';
import { transactionSchema, type Schema } from '../validations/schema';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  onDeleteTransaction: (transactionId: string) => Promise<void>;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
}

type IncomeExpense = 'income' | 'expense';

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
}: TransactionFormProps) => {
  const formWidth = 320;

  const ExpenseCategories: CategoryItem[] = [
    { label: '食費', icon: <FastfoodIcon fontSize='small' /> },
    { label: '日用品', icon: <AlarmIcon fontSize='small' /> },
    { label: '住居費', icon: <AddHomeIcon fontSize='small' /> },
    { label: '交際費', icon: <Diversity3Icon fontSize='small' /> },
    { label: '娯楽', icon: <SportsTennisIcon fontSize='small' /> },
    { label: '交通費', icon: <TrainIcon fontSize='small' /> },
  ];

  const IncomeCategories: CategoryItem[] = [
    { label: '給与', icon: <WorkIcon fontSize='small' /> },
    { label: '副収入', icon: <AddBusinessIcon fontSize='small' /> },
    { label: 'お小遣い', icon: <SavingsIcon fontSize='small' /> },
  ];

  const [categories, setCategories] = useState(ExpenseCategories);
  // console.log(categories);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      category: '',
      amount: 0,
      content: '',
    },
    resolver: zodResolver(transactionSchema),
  });
  console.log(errors);

  // 収支タイプを切り替える関数
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
    setValue('category', '');
    setValue('amount', 0);
    setValue('content', '');
  };

  // 収支タイプを監視
  const currentType = watch('type');
  // console.log(currentType);

  useEffect(() => {
    const newCategories =
      currentType === 'expense' ? ExpenseCategories : IncomeCategories;
    // console.log(newCategories);
    setCategories(newCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentType]);

  // 送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log(data);
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          console.log('更新しました。');
          setSelectedTransaction(null);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log('保存しました。');
        })
        .catch((error) => {
          console.error(error);
        });
    }
    reset({
      type: 'expense',
      date: currentDay,
      category: '',
      amount: 0,
      content: '',
    });
  };

  useEffect(() => {
    // 選択肢が更新されたか確認
    if (selectedTransaction) {
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      console.log(categories);
      console.log(categoryExists);
      setValue('category', categoryExists ? selectedTransaction.category : '');
    }
  }, [selectedTransaction, categories, setValue]);

  // フォームの内容を更新
  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('amount', selectedTransaction.amount);
      setValue('content', selectedTransaction.content);
    } else {
      reset({
        type: 'expense',
        date: currentDay,
        category: '',
        amount: 0,
        content: '',
      });
    }
  }, [selectedTransaction, setValue, currentDay, reset]);

  // フォームを削除
  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
    }
  };

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay, setValue]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        right: isEntryDrawerOpen ? formWidth : 0, // フォームの位置を調整
        width: formWidth,
        height: '100%',
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create('right', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: 'border-box', // ボーダーとパディングをwidthに含める
        boxShadow: '0px 0px 15px -5px #777777',
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Typography variant='h6'>入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name='type'
            control={control}
            render={({ field }) => {
              // console.log({ ...field });
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={
                      field.value === 'expense' ? 'contained' : 'outlined'
                    }
                    color='error'
                    onClick={() => incomeExpenseToggle('expense')}
                  >
                    支出
                  </Button>
                  <Button
                    variant={
                      field.value === 'expense' ? 'outlined' : 'contained'
                    }
                    color='primary'
                    onClick={() => incomeExpenseToggle('income')}
                  >
                    収入
                  </Button>
                </ButtonGroup>
              );
            }}
          />
          {/* 日付 */}
          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='日付'
                type='date'
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name='category'
            control={control}
            render={({ field }) => {
              // console.log({ ...field });
              return (
                <TextField
                  {...field}
                  id='カテゴリ'
                  label='カテゴリ'
                  select
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.label} value={category.label}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
          {/* 金額 */}
          <Controller
            name='amount'
            control={control}
            render={({ field }) => {
              // console.log({ ...field });
              return (
                <TextField
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10) || 0;
                    field.onChange(newValue);
                  }}
                  label='金額'
                  type='number'
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              );
            }}
          />

          {/* 内容 */}
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label='内容'
                type='text'
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          {/* 保存 or 更新 ボタン */}
          <Button
            type='submit'
            variant='contained'
            color={currentType === 'income' ? 'primary' : 'error'}
            fullWidth
          >
            {selectedTransaction ? '更新' : '保存'}
          </Button>

          {selectedTransaction && (
            // 削除ボタン
            <Button
              onClick={handleDelete}
              variant='outlined'
              color='secondary'
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
