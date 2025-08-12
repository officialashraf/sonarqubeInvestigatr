// import React from 'react';
// import styles from './intervalFiled.module.css';

// export const IntervalField = ({
//   label,
//   value,
//   unit,
//   onValueChange,
//   onUnitChange,
//   disabled = false,
//   isDarkWeb = false, // New prop add kiya
// }) => {
//   // Dark web ke liye minimum value calculate karo
//   const allowedHourValues = [3, 6, 9, 12];
//   const getMinValue = () => {
//     if (isDarkWeb) {
//       return unit === 'hours' ? 2 : 1; // hours ke liye min 2, seconds ke liye min 1
//     }
//     return unit === 'minutes' ? 15 : 1; // normal sources ke liye
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.group}>
//         <label className={`${styles.label} 
//                                     ${disabled ? styles.disabledLabel : ''}
//                   `}>
//           {label}
//         </label>
//         <div className={styles.inputSelectContainer}>
//           <input
//             type="number"
//             min={getMinValue()} // Dynamic minimum value
//             className={styles.inputse}
//             value={value}
//             onChange={(e) => onValueChange(e.target.value)}
//             disabled={disabled}
//           />

//           <select
//             className={styles.select}
//             value={unit}
//             onChange={(e) => onUnitChange(e.target.value)}
//             disabled={disabled}
//           >
//             <option value="" disabled>Select Unit</option>
//             {/* Dark web ke liye minutes option nahi dikhao */}
//             {!isDarkWeb && <option value="minutes">Minutes</option>}
//             <option value="hours">Hours</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };
import React from 'react';
import styles from './intervalFiled.module.css';

export const IntervalField = ({
  label,
  value,
  unit,
  onValueChange,
  onUnitChange,
  disabled = false,
  isDarkWeb = false,
}) => {
  // Allowed intervals for hours (as per your requirement)
  const allowedHours = [3, 6, 9, 12];
  return (
    <div className={styles.wrapper}>
      <div className={styles.group}>
        <label className={`${styles.label} ${disabled ? styles.disabledLabel : ''}`}>
          {label}
        </label>
        <div className={styles.inputSelectContainer}>

          {/* dropdown for allowed hour intervals only */}
          <select
            className={styles.select}
            value={value}
            onChange={e => onValueChange(Number(e.target.value))}
            disabled={disabled}
          >
            {allowedHours.map(h => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          {/* fixed unit display, disabled, no other option */}
          <select
            className={styles.select}
            value="hours"
            disabled={true}
            onChange={() => { }}
          >
            <option value="hours">Hours</option>
          </select>

        </div>
      </div>
    </div>
  );
};

  // Dark web minimum value logic for other units
  // const getMinValue = () => {
  //   if (isDarkWeb) {
  //     return unit === 'hours' ? 2 : 1; // but we'll override hours with select
  //   }
  //   return unit === 'minutes' ? 15 : 1;
  // };

//   const renderValueInput = () => {
//     if (unit === 'hours') {
//       // Show dropdown with allowed hour values only
//       return (
//         <select
//           className={styles.select}
//           value={value}
//           onChange={e => onValueChange(Number(e.target.value))}
//           disabled={disabled}
//         >
//           {allowedHourValues.map((hour) => (
//             <option key={hour} value={hour}>
//               {hour} hours
//             </option>
//           ))}
//         </select>
//       );
//     } else {
//       // For other units, keep the number input with min value
//       return (
//         <input
//           type="number"
//           // min={getMinValue()}
//           className={styles.inputse}
//           value={value}
//           onChange={e => onValueChange(Number(e.target.value))}
//           disabled={disabled}
//         />
//       );
//     }
//   };

//   return (
//     <div className={styles.wrapper}>
//       <div className={styles.group}>
//         <label
//           className={`${styles.label} ${disabled ? styles.disabledLabel : ''}`}
//         >
//           {label}
//         </label>
//         <div className={styles.inputSelectContainer}>
//           {renderValueInput()}
//           <select
//             className={styles.select}
//             value={value}
//             onChange={e => onUnitChange(e.target.value)}
//             disabled={disabled}
//           >
//             {/* <option value="" disabled>
//               Select Unit
//             </option>
//             {!isDarkWeb}
//             <option value="hours">Hours</option> */}
//             {allowedHourValues.map(hour => (
//               <option key={hour} value={hour}>
//                 {hour} hours
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };
