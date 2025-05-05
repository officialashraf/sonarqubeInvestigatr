import React from 'react';
import { Form } from 'react-bootstrap';

const InputField = ({ label, type, value, onChange, placeholder, controlId, name ,autocomplete}) => {
    return (
        <Form.Group controlId={controlId} className="mb-3">
            <Form.Label className='labell'>{label}</Form.Label>
            <Form.Control
                type={type}
                name={name} // Add the name attribute
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autocomplete} 
                required
              
            />
        </Form.Group>
    );
};

export default InputField;
