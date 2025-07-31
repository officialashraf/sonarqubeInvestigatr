import React from 'react';
import styles from './intervalFiled.module.css';

export const IntervalField = ({
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
  disabled = false,
  isDarkWeb = false, // New prop add kiya
}) => {
  // Dark web ke liye minimum value calculate karo
  const getMinValue = () => {
    if (isDarkWeb) {
      return unit === 'hours' ? 2 : 1; // hours ke liye min 2, seconds ke liye min 1
    }
    return unit === 'minutes' ? 15 : 1; // normal sources ke liye
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <label className={`${styles.label} 
                                    ${disabled ? styles.disabledLabel : ''}
                  `}>
          {label}
        </label>
        <div className={styles.inputSelectContainer}>
          <input
            type="number"
            min={getMinValue()} // Dynamic minimum value
            className={styles.inputse}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={disabled}
          />

          <select
            className={styles.select}
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            disabled={disabled}
          >
            <option value="" disabled>Select Unit</option>
            {/* Dark web ke liye minutes option nahi dikhao */}
            {!isDarkWeb && <option value="minutes">Minutes</option>}
            <option value="hours">Hours</option>
          </select>
        </div>
      </div>
    </div>
  );
};