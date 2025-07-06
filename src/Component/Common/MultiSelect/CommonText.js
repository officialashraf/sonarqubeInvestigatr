import React from 'react';

const CommonTextArea = ({
    label,
    name,
    value,
    onChange,
    placeholder = 'Enter text...',
    disabled = false,
}) => {
    return (
        <div style={{ marginBottom: '16px', position: 'relative', overflow: 'visible' }}>
            {label && (
                <label
                    htmlFor={name}
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
                    }}
                >
                    {label}
                </label>
            )}

            <div
                style={{
                    border: '1px solid #0073CF',
                    borderRadius: '15px',
                    marginTop: '20px',
                    overflow: 'visible',
                }}
            >
                <textarea
                    className="com"
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={4}
                    style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'vertical',
                        backgroundColor: '#101d2b',
                        color: 'white',
                        padding: '10px 12px',
                        fontSize: '14px',
                        borderRadius: '15px',
                    }}
                ></textarea>
            </div>
        </div>
    );
};

export default CommonTextArea;
