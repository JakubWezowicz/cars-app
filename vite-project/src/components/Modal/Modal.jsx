import "./Modal.css";

const Modal = ({ car, mousePosition }) => {
  return (
    <div
      className="modal"
      style={{ left: mousePosition.x, top: mousePosition.y }}
    >
      <h3>{car.Brand}</h3>
      <p>{car.Model}</p>
      <p>{car.Year} y.</p>
      {car.Available ? (
        <p className="available" style={{ color: "green" }}>
          Available
        </p>
      ) : (
        <p className="unavailable" style={{ color: "red" }}>
          Unavailable
        </p>
      )}
    </div>
  );
};

export default Modal;
