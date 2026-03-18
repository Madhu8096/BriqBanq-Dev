import React, { forwardRef, useState, useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

const DatePicker = forwardRef(({ 
  value, 
  onChange, 
  placeholderText = "MM/DD/YYYY", 
  className = "", 
  disabled = false,
  minDate = null,
  maxDate = null,
  ...props 
}, ref) => {

  const parsedValueDate = value ? parse(value, 'MM/dd/yyyy', new Date()) : null;
  const validValueDate = parsedValueDate && isValid(parsedValueDate) ? parsedValueDate : null;

  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(validValueDate || new Date()); // Default to today if null for display purposes
  const [inputValue, setInputValue] = useState(value || '');
  const [placement, setPlacement] = useState('top');
  
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue && !isOpen) {
      setInputValue(value || '');
      setTempDate(validValueDate || new Date());
    }
  }, [value, isOpen, validValueDate, inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Always force placement to 'top' as per user request to open above the input field
    setPlacement('top');
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (isOpen) {
          setTempDate(validValueDate || new Date());
          setInputValue(validValueDate ? format(validValueDate, 'MM/dd/yyyy') : '');
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, validValueDate]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parse(val, 'MM/dd/yyyy', new Date());
    if (isValid(parsed)) {
      setTempDate(parsed);
      if (onChange) onChange(val, parsed);
    } else {
      if (onChange) onChange(val, null);
    }
  };

  const handleCalendarSelect = (date) => {
    setTempDate(date);
    // Wait for OK to confirm to parent
  };

  const handleOk = () => {
    if (tempDate && isValid(tempDate)) {
      const formatted = format(tempDate, 'MM/dd/yyyy');
      setInputValue(formatted);
      if (onChange) onChange(formatted, tempDate);
    } else {
      setInputValue('');
      if (onChange) onChange('', null);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(validValueDate || new Date());
    setInputValue(value || '');
    setIsOpen(false);
  };
  
  const handleClear = () => {
    setTempDate(new Date());
    setInputValue('');
    if (onChange) onChange('', null);
    setIsOpen(false);
  };

  const onInputFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const handlePrevYear = () => changeYear(date.getFullYear() - 1);
    const handleNextYear = () => changeYear(date.getFullYear() + 1);

    return (
      <div className="w-full bg-white px-4 pt-4 pb-2">
        <div className="flex justify-between items-center w-[280px] mx-auto space-x-6 border-b-2 border-slate-200/60 pb-3">
          {/* Month Selector */}
          <div className="flex-1 flex justify-between items-center text-[#757575]">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className="px-2 hover:bg-slate-100 rounded transition-colors disabled:opacity-30 cursor-pointer text-lg font-bold"
              type="button"
              style={{ lineHeight: 1 }}
            >
              &#10094;
            </button>
            <span className="text-[15px] font-medium tracking-wide">
              {format(date, 'MMMM')}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className="px-2 hover:bg-slate-100 rounded transition-colors disabled:opacity-30 cursor-pointer text-lg font-bold"
              type="button"
              style={{ lineHeight: 1 }}
            >
              &#10095;
            </button>
          </div>
          
          {/* Year Selector */}
          <div className="flex-1 flex justify-between items-center text-[#757575]">
            <button
              onClick={handlePrevYear}
              className="px-2 hover:bg-slate-100 rounded transition-colors cursor-pointer text-lg font-bold"
              type="button"
              style={{ lineHeight: 1 }}
            >
              &#10094;
            </button>
            <span className="text-[15px] font-medium tracking-wide">
              {format(date, 'yyyy')}
            </span>
            <button
              onClick={handleNextYear}
              className="px-2 hover:bg-slate-100 rounded transition-colors cursor-pointer text-lg font-bold"
              type="button"
              style={{ lineHeight: 1 }}
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    );
  };

  const defaultClassName = "w-full border border-slate-300 rounded-md py-2 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#33A8A0] focus:border-[#33A8A0] disabled:bg-slate-50 disabled:text-slate-500";
  const isError = className.includes('border-red-500');
  const baseClassName = isError 
    ? "w-full border border-red-500 ring-1 ring-red-500 rounded-md py-2 pl-10 pr-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-slate-50 disabled:text-slate-500"
    : defaultClassName;
  const finalClassName = className.includes('w-full') && !isError ? className + " pl-10" : `${baseClassName} ${className.replace(/w-full|border-slate-300|rounded-md|px-3|py-2\.*?|text-sm|bg-white/g, '').trim()}`;

  const isValueValid = validValueDate && isValid(validValueDate);
  const displayDate = isValid(tempDate) ? tempDate : (isValueValid ? validValueDate : new Date());

  // Inject scoped CSS strictly targeting our wrapper to kill any Tailwind interference
  const scopedCss = `
    .exact-dp-wrapper .react-datepicker {
      border: none !important;
      background: transparent !important;
      font-family: inherit !important;
    }
    .exact-dp-wrapper .react-datepicker__header {
      background: transparent !important;
      border-bottom: none !important;
      padding: 0 !important;
    }
    .exact-dp-wrapper .react-datepicker__month-container {
      width: 100% !important;
      float: none !important;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .exact-dp-wrapper .react-datepicker__day-names {
      display: flex !important;
      justify-content: space-between !important;
      width: 280px !important;
      margin: 0 auto !important;
      margin-top: 10px !important;
    }
    .exact-dp-wrapper .react-datepicker__day-name {
      color: #33A8A0 !important;
      font-weight: 500 !important;
      font-size: 13px !important;
      width: 40px !important;
      margin: 0 !important;
      text-transform: uppercase;
    }
    .exact-dp-wrapper .react-datepicker__month {
      margin: 0 !important;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .exact-dp-wrapper .react-datepicker__week {
      display: flex !important;
      justify-content: space-between !important;
      width: 280px !important;
    }
    .exact-dp-wrapper .react-datepicker__day {
      width: 40px !important;
      height: 40px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 2px 0 !important;
      font-size: 14px !important;
      color: #444 !important;
      font-weight: 500 !important;
      border: none !important;
      background: transparent !important;
      outline: none !important;
    }
    .exact-dp-wrapper .react-datepicker__day:hover {
      background: #f0f0f0 !important;
      border-radius: 4px !important;
    }
    .exact-dp-wrapper .react-datepicker__day--selected {
      background: #E0E0E0 !important;
      color: #222 !important;
      border-radius: 6px !important;
    }
    /* Inner blue dot implementation */
    .day-dot-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .day-dot {
      position: absolute;
      top: 10px;
      right: 6px;
      width: 4px;
      height: 4px;
      background-color: #00BCD4;
      border-radius: 50%;
    }
  `;

  return (
    <div className="relative w-full material-datepicker-wrapper inline-block" ref={wrapperRef}>
      <style>{scopedCss}</style>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Calendar className={`h-4 w-4 ${disabled ? 'text-slate-400' : 'text-slate-500'}`} />
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={onInputFocus}
        onClick={onInputFocus}
        placeholder={placeholderText}
        className={finalClassName}
        disabled={disabled}
        ref={ref}
        {...props}
      />

      {isOpen && !disabled && (
        <div 
          className="absolute z-[9999]" 
          style={{
             ...(placement === 'top' ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' }),
             left: 0
          }}
        >
          {/* Exact Outer Container Shape */}
          <div className="flex bg-[#FAFAFA] shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-sm overflow-hidden font-sans border border-slate-200" style={{ width: 'min-content' }}>
            
            {/* Left Sidebar spanning full height */}
            <div className="text-white flex flex-col hidden sm:flex shrink-0 w-[140px]">
              {/* Friday Box */}
              <div className="bg-[#2D8E87] w-full py-[18px] text-center text-[15px] font-medium tracking-wide">
                {format(displayDate, 'EEEE')}
              </div>
              
              {/* Main Teal Box */}
              <div className="bg-[#33A8A0] w-full flex-col justify-center items-center flex-1 px-4 py-6 text-center">
                <div className="text-[64px] font-bold leading-none tracking-tight mb-2">
                  {format(displayDate, 'd')}
                </div>
                <div className="text-[18px] font-medium mb-1">
                  {format(displayDate, 'MMMM')}
                </div>
                <div className="text-[22px] font-medium text-white/80 mt-1">
                  {format(displayDate, 'yyyy')}
                </div>
              </div>
            </div>
            
            {/* Right Content */}
            <div className="flex flex-col bg-[#FAFAFA] min-w-[320px]">
              <div className="exact-dp-wrapper">
                <ReactDatePicker
                  inline
                  selected={tempDate}
                  onChange={handleCalendarSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  renderCustomHeader={CustomHeader}
                  renderDayContents={(day, date) => {
                     const isSelected = tempDate && date.toDateString() === tempDate.toDateString();
                     return (
                        <div className="day-dot-container">
                           {day}
                           {isSelected && <div className="day-dot"></div>}
                        </div>
                     );
                  }}
                  formatWeekDay={nameOfDay => nameOfDay.substring(0, 1)}
                />
              </div>
              
              {/* Action Footer padding matched to header alignment */}
              <div className="flex items-center justify-between px-6 pt-2 pb-4 bg-[#FAFAFA]">
                 <button
                    type="button"
                    onClick={handleClear}
                    className="px-2 py-1.5 text-[14px] font-semibold text-[#EF5350] hover:bg-black/5 rounded transition-colors"
                 >
                    Clear
                 </button>
                 <div className="flex gap-4">
                   <button
                      type="button"
                      onClick={handleCancel}
                      className="px-2 py-1.5 text-[14px] font-semibold text-[#33A8A0] hover:bg-black/5 rounded transition-colors uppercase"
                   >
                      CANCEL
                   </button>
                   <button
                      type="button"
                      onClick={handleOk}
                      className="px-2 py-1.5 text-[14px] font-semibold text-[#33A8A0] hover:bg-black/5 rounded transition-colors uppercase"
                   >
                      OK
                   </button>
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
