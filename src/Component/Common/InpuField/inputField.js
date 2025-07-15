import React from 'react';
import styles from './inputField.module.css';

export const InputField = React.forwardRef(
  (
    {
      label,
      type = 'text',
      value,
      onChange,
      onKeyDown,
      placeholder,
      name,
      autoComplete,
      autoFocus,
      readOnly,
      onFocus,
      error = false,  // new prop (true/false)
      disabled
    },
    ref
  ) => {
    return (
      <div className={styles.inputWrapper}>
        <div className={`${styles.inputGroup} ${error ? styles.error : ''}`}>
          <label className={`${styles.label} 
          ${error ? styles.errorLabel : ''}
           ${disabled ? styles.disabledLabel : ''}
          `}>
            {label}
          </label>
          <input
            ref={ref}
            className={`${styles.input} ${error ? styles.errorInput : ''}`}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
              onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            readOnly={readOnly}
            onFocus={onFocus}
            required
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
