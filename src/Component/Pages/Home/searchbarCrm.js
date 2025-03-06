import React, { useState } from 'react';

const DataTable1 = () => {
    
  const [filter, setFilter] = useState({ search: '', date: '' });

  const data = [ { col1: 'Hello', col2: 'World', dateField: '2024-12-01' },
    { col1: 'react-table', col2: 'rocks', dateField: '2024-12-02' },
     { col1: 'whatever', col2: 'you want', dateField: '2024-12-03' }, // Add more data here... 
    ];
  // Filter function based on search input and date picker
  const filteredData = data.filter(item => {
    const dateMatch = filter.date ? item.dateField.startsWith(filter.date) : true;
    const searchMatch = Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filter.search.toLowerCase())
    );
    return dateMatch && searchMatch;
  });
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={filter.search}
        onChange={e => setFilter({ ...filter, search: e.target.value })}
        style={{ marginRight: '10px' }}
      />
      <input
        type="date"
        value={filter.date}
        onChange={e => setFilter({ ...filter, date: e.target.value })}
        style={{ marginRight: '10px' }}
      />
      <table style={{ border: '1px solid black', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Date</th>
            {/* Add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.col1}</td>
              <td>{item.col2}</td>
              <td>{item.dateField}</td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable1;
