import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import TuneIcon from '@mui/icons-material/Tune';
import styles from './SearchBar.module.css';

const SearchBar = ({
    inputValue,
    onChange,
    onKeyPress,
    onSearchClick,
    onTuneClick,
    isLoading = false,
    isReadOnly = false,
    inputRef,
    onFocus,
    sharedSxStyles = {},
}) => {
    return (
        <div className={styles.searchHeader}>
            <TextField
                fullWidth
                className={styles.searchBar}
                InputProps={{
                    readOnly: isReadOnly,
                    onFocus: onFocus,
                    inputRef: inputRef,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className={styles.searchIcon} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <SendIcon
                                className={styles.iconButton}
                                style={{ cursor: isLoading ? 'default' : 'pointer' }}
                                onClick={isLoading ? null : onSearchClick}
                            />
                            <TuneIcon
                                className={styles.iconButton}
                                style={{ cursor: 'pointer' }}
                                onClick={onTuneClick}
                            />
                        </InputAdornment>
                    ),
                    style: {
                        height: '38px',
                        padding: '0 8px',
                        borderRadius: '15px',
                        marginBottom: '10px',
                        backgroundColor: 'var(--color-colors-secondary)',   
                        color: 'var(--color-colors-neutralText)',
                    },
                }}
                type="text"
                value={inputValue}
                onChange={onChange}
                onKeyPress={onKeyPress}
                placeholder="Search..."
                sx={sharedSxStyles}
                disabled={isLoading}
            />
        </div>
    );
};

export default SearchBar;