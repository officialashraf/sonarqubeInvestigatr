import Pagination from 'react-bootstrap/Pagination'
import './pagination.css'
const Pagination1 = () => {

  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} >
        {number}
      </Pagination.Item>
    );
  }
  return (
    <>
      <div>
        <Pagination >{items}</Pagination>
      </div>
    </>
  )
}

export default Pagination1
