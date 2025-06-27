import React from 'react';
import styles from './inputField.module.css';

export const InputField = React.forwardRef(
  (
    {
      label,
      type = 'text',
      value,
      onChange,
      placeholder,
      name,
      autoComplete,
      autoFocus,
      readOnly,
      onFocus,
      error = false,  // ✅ new prop (true/false)
    },
    ref
  ) => {
    return (
      <div className={styles.inputWrapper}>
        <div className={`${styles.inputGroup} ${error ? styles.error : ''}`}>
          <label className={`${styles.label} ${error ? styles.errorLabel : ''}`}>
            {label}
          </label>
          <input
            ref={ref}
            className={`${styles.input} ${error ? styles.errorInput : ''}`}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            readOnly={readOnly}
            onFocus={onFocus}
            required
          />
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';
