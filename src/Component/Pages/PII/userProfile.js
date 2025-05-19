import React, { useState } from 'react';

const UserProfileContacts = () => {
  // Sample data
  const [selectedUser, setSelectedUser] = useState({
    id: 1,
    initial: 'P',
    name: 'Patricia Lebsack',
    phone: '493-170-9623 x156',
    email: 'Julianne.OConner@kory.org',
    location: 'South Elvis',
    aliases: 'Patty, Pat',
    dob: '15/03/1988 (37 years)',
    gender: 'Female'
  });

  // All contacts
  const contacts = [
    {
      id: 1,
      initial: 'P',
      name: 'Patricia Lebsack',
      phone: '493-170-9623 x156',
      email: 'Julianne.OConner@kory.org',
      location: 'South Elvis',
      aliases: 'Patty, Pat',
      dob: '15/03/1988 (37 years)',
      gender: 'Female'
    },
    {
      id: 2,
      initial: 'C',
      name: 'Chelsey Dietrich',
      phone: '(254)954-1289',
      email: 'Lucio_Hettinger@annie.ca',
      location: 'Roscoeview',
      aliases: 'Chels',
      dob: '12/06/1991 (34 years)',
      gender: 'Female'
    },
    {
      id: 3,
      initial: 'M',
      name: 'Mrs. Dennis Schulist',
      phone: '1-477-935-8478 x6430',
      email: 'Karley_Dach@jasper.info',
      location: 'South Christy',
      aliases: 'Denny',
      dob: '23/11/1980 (45 years)',
      gender: 'Female'
    },
    {
      id: 4,
      initial: 'K',
      name: 'Kurtis Weissnat',
      phone: '210.067.6132',
      email: 'Telly.Hoeger@billy.biz',
      location: 'Howemouth',
      aliases: 'Kurt',
      dob: '30/08/1995 (30 years)',
      gender: 'Male'
    },
    {
      id: 5,
      initial: 'N',
      name: 'Nicholas Runolfsdottir V',
      phone: '586.493.6943 x140',
      email: 'Sherwood@rosamond.me',
      location: 'Aliyaview',
      aliases: 'Nick',
      dob: '05/02/1990 (35 years)',
      gender: 'Male'
    },
    {
      id: 6,
      initial: 'G',
      name: 'Glenna Reichert',
      phone: '(775)976-6794 x41206',
      email: 'Chaim_McDermott@dana.io',
      location: 'Bartholomebury',
      aliases: 'Glen',
      dob: '18/07/1993 (32 years)',
      gender: 'Female'
    }
  ];

  // Select a user to display in the sidebar
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar with selected user details */}
      <div className="w-80 bg-black text-white p-4">
        <div className="pb-4 font-medium text-xl flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-3">
            <span className="text-white font-medium">{selectedUser.initial}</span>
          </div>
          <span>{selectedUser.name}</span>
        </div>

        <div className="py-4 border-t border-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-gray-300">Aliases</span>
          <div className="ml-auto text-gray-400">{selectedUser.aliases}</div>
        </div>

        <div className="py-4 border-t border-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
          </svg>
          <span className="text-gray-300">Age & Date of Birth</span>
          <div className="ml-auto text-gray-400">{selectedUser.dob}</div>
        </div>

        <div className="py-4 border-t border-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
          <span className="text-gray-300">Gender</span>
          <div className="ml-auto text-gray-400">{selectedUser.gender}</div>
        </div>

        <div className="py-4 border-t border-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-gray-300">Phone</span>
          <div className="ml-auto text-gray-400">{selectedUser.phone}</div>
        </div>

        <div className="py-4 border-t border-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-300">Email</span>
          <div className="ml-auto text-gray-400 truncate max-w-[120px]">{selectedUser.email}</div>
        </div>

        <div className="py-4 border-t border-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-300">Location</span>
          <div className="ml-auto text-gray-400">{selectedUser.location}</div>
        </div>
      </div>

      {/* Right side contact cards grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className="bg-black text-white rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-900 transition-colors"
              onClick={() => handleSelectUser(contact)}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-3">
                  <span className="text-white font-medium">{contact.initial}</span>
                </div>
                <span className="text-lg font-medium">{contact.name}</span>
              </div>

              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{contact.phone}</span>
              </div>

              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{contact.email}</span>
              </div>

              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{contact.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileContacts;