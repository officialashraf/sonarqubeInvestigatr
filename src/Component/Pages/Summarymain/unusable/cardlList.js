import CardList from '../../../Home/cards'; // Adjust the import path as necessary
import { CloudDownload, Upload, Cloud, Broadcast, Diagram3 } from 'react-bootstrap-icons';

const data1 = [
  { name: 'Local Uploads', number: 25, icon: <Upload className="logo-icon" /> },
  { name: 'FTP', number: 10, icon: <CloudDownload className="logo-icon" /> },
  { name: 'OSINT', number: 25, icon: < Diagram3 className="logo-icon" /> },
  { name: 'API', number: 10, icon: < Cloud className="logo-icon" /> },
  { name: 'Live Link', number: 25, icon: < Broadcast className="logo-icon" /> },


  // Additional data items
];

const Component1 = () => {
  return <CardList data={data1} />;
}

export default Component1;
