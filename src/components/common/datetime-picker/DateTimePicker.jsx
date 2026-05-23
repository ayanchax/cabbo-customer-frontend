import { useState } from 'react';
import {DateTimeField,DateTimeSheet } from '@/components/common/datetime-picker';

function DateTimePicker({
  value,
  onChange,
  label = 'Date & time',
  placeholder = 'Select date & time',
  minDateTime,
  ...rest
  
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DateTimeField
        label={label}
        value={value}
        placeholder={placeholder}
        onClick={() => setOpen(true)}
        {...rest}
         
      />

      <DateTimeSheet
        key={open ? value?.getTime() || 'empty' : 'closed'}
        open={open}
        value={value}
        onClose={() => setOpen(false)}
        onConfirm={onChange}
        minDateTime={minDateTime}
        {...rest}
         
      />
    </>
  );
}

export  {DateTimePicker};