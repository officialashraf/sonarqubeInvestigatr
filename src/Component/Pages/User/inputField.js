import React from 'react';
import { Form } from 'react-bootstrap';

const InputField = ({ label, type, value, onChange, placeholder,  name, autoComplete }) => {
    return (
        <Form.Group  className="mb-3">
            <Form.Label className='labell'>{label}</Form.Label>
            <Form.Control
                type={type}
                name={name} // Add the name attribute
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
            />
        </Form.Group>
    );
};

export default InputField;
