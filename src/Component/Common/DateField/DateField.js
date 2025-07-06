import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

const CommonDateInput = ({
    label,
    value,
    placeholder = "Select date...",
    onClickIcon,
    readOnly = true,
    sx = {},
    inputProps = {},
    showIcon = true,
}) => {
    return (
        <div style={{ marginBottom: '16px', position: 'relative' }}>
            {label && (
                <label
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '12px',
                        backgroundColor: 'var(--color-colors-primaryAccent)',
                        padding: '0 6px',
                        color: 'var(--color-colors-neutralText)',
                        fontWeight: 'normal',
                        zIndex: 1,
                        borderRadius: '0.75rem',
                        transition: 'background-color 0.3s ease',
                    }}
                >
                    {label}
                </label>
            )}

            <TextField
                fullWidth
                InputProps={{
                    ...(showIcon && {
                    endAdornment: (
                        <InputAdornment position="end">
                            <CalendarToday
                                style={{ cursor: 'pointer', color: '#0073CF' }}
                                onClick={onClickIcon}
                            />
                        </InputAdornment>
                    ),
                    }),
                    style: {
                        height: '38px',
                        color: 'white',
                        borderRadius: '15px',
                        ...inputProps?.style,
                        border: '1px solid #0073CF',
                        background: '#101D2B',
                    },
                }}
                placeholder={placeholder}
                value={value}
                readOnly={readOnly}
                sx={sx}
            />
        </div>
    );
};

export default CommonDateInput;
