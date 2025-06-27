import React from "react";
import { Card } from "react-bootstrap";

const CardRow = ({ cards }) => {
  return (
    <div className="d-flex gap-3 mb-3">
      {cards.map((card, index) => (
        <Card key={index} style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{card.title}</Card.Title>
            <Card.Text>{card.content}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default CardRow;
