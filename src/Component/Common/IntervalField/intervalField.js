import React from 'react';
import styles from './intervalFiled.module.css';

export const IntervalField = ({
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
  disabled = false,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        {/* <label className={styles.label}>{label} *</label> */}
        <label className={`${styles.label} 
                                    ${disabled ? styles.disabledLabel : ''}
                  `}>
          {label}
        </label>
        <div className={styles.inputSelectContainer}>
          <input
            type="number"
            min="1"
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
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
      </div>
    </div>
  );
};
