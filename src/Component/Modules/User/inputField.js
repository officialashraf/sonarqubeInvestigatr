// import React from 'react';
// import { Form } from 'react-bootstrap';

// const InputField = ({ label, type, value, onChange, placeholder, name, autoComplete,au }) => {
//     return (
//         <Form.Group className="mb-3">
//             <Form.Label className='labell'>{label}</Form.Label>
//             <Form.Control
//                 type={type}
//                 name={name} // Add the name attribute
//                 value={value}
//                 onChange={onChange}
//                 placeholder={placeholder}
//                 autoComplete={autoComplete}
//                 required
//                 autoFocus={autoFocus}
               
//             />
//         </Form.Group>
//     );
// };

// export default InputField;
import React from 'react';
import { Form } from 'react-bootstrap';

export const InputField = React.forwardRef(({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  name, 
  autoComplete,
  autoFocus,
  readOnly, // Changed from isReadOnly
  onFocus // Changed from handleFocus
}, ref) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className='labell'>{label}</Form.Label>
      <Form.Control
        ref={ref} // Use ref prop directly
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        autoFocus={autoFocus}
        readOnly={readOnly}
        onFocus={onFocus}
      />
    </Form.Group>
  );
});

InputField.displayName = 'InputField';