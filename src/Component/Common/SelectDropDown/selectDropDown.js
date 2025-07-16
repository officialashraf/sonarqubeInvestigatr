import React from 'react';
import styles from './selectDropDown.module.css';

 const DropdownField = ({
  label,
  value,
  source,
  onChange,
  options = [],
  name,
  error = false,
  disabled = false,
  customPadding,
  customnWrapper
}) => {
  return (
    <div className={`${styles.dropdownWrapper} ${customnWrapper || ''}`}>
      <div className={`${styles.dropdownGroup} ${error ? styles.error : ''}`}>
         <label className={`${styles.label} 
                  ${error ? styles.errorLabel : ''}
                   ${disabled ? styles.disabledLabel : ''}
                  `}>
                    {label}
                  </label>
           <div className={styles.selectWrapper}>
        <select
 className={`${styles.select} ${error ? styles.errorSelect : ''} ${customPadding || ''}`}  // Only override if value is passed

          value={value}
          onChange={onChange}
          name={name}
          disabled={disabled}
          required
        >
          <option value="" disabled>{source}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        </div>
      </div>
    </div>
  );
};
export default DropdownField