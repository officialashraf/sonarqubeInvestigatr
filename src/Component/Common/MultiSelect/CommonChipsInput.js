import React from 'react';
import './CommonChipsInput.css';

const CommonChipsInput = ({
    label,
    value = '',
    onChange,
    onKeyDown,
    chips = [],
    removeChip,
    maxChips = 5,
    placeholder = 'Type and press Enter to add...',
    disabled = false,
}) => {
    return (
        <div style={{ marginBottom: '16px', position: 'relative', overflow: 'visible' }}>
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
                    }}
                >
                    {label}
                </label>
            )}

            <div className="outlined-chip-container">
                <input
                    className="chip-input com"
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || chips.length >= maxChips}
                />

                {chips.length > 0 && (
                    <div className="chip-list">
                        {chips.map((chip, index) => (
                            <div key={index} className="chip">
                                {chip}
                                <button
                                    type="button"
                                    className="chip-remove"
                                    onClick={() => removeChip(index)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommonChipsInput;
