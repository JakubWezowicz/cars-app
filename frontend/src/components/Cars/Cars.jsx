import { useSelector, useDispatch } from "react-redux";
import { setCars } from "../../redux/cars";
import EditForm from "../EditForm/EditForm";
import Car from "../../assets/car_icon.png";
import "./Cars.css";
import { useState } from "react";

const Cars = ({
  setMousePosition,
  setShowModal,
  showModal,
  setCurrentCar,
  setError,
  isLoading,
}) => {
  const { carsData } = useSelector((state) => state.cars);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const handleMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  const handleMouseEnter = (car) => {
    if (!showModal) {
      setShowModal(true);
    }
    setCurrentCar(car);
  };
  const editCar = (car) => {
    const changedCar = { ...car, Available: !car.Available };
    const newData = carsData.map((car) => {
      if (car.ID == changedCar.ID) {
        return changedCar;
      }
      return car;
    });
    fetch(`/api/cars/${car.ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...changedCar, task: "changeAvailable" }),
    })
      .then(() => {
        dispatch(setCars(newData));
        setCurrentCar(changedCar);
      })

      .catch((err) => setError(err.message));
  };
  const handleDelete = (car) => {
    const newData = carsData.filter((item) => item.ID !== car.ID);
    fetch(`http://localhost:8080/api/cars/${car.ID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        dispatch(setCars(newData));
        setShowModal(false);
      })
      .catch((err) => setError(err.message));
  };
  const handleEdit = (car) => {
    console.log(editing?.id, car.ID);
    if (editing?.id == car.ID) {
      setEditing((prev) => ({ ...prev, edit: !prev.edit }));
      return;
    }
    setEditing({ id: car.ID, edit: true });
  };
  return (
    <div className="cars">
      {(!carsData || (carsData.length == 0 && !isLoading)) && (
        <p>There is no cars</p>
      )}

      <ul>
        {carsData &&
          carsData.map((car) => (
            <li key={car.ID}>
              <h3>
                {car.Brand} {car.Model}
              </h3>
              <img
                src={Car}
                alt="car"
                onMouseMove={handleMove}
                onMouseEnter={() => handleMouseEnter(car)}
                onMouseLeave={() => setShowModal(false)}
                onClick={() => editCar(car)}
              />
              <button onClick={() => handleEdit(car)} className="manage-button">
                EDIT
              </button>
              {editing?.id == car.ID && editing.edit && (
                <EditForm car={car} key={editing.id} setEditing={setEditing} />
              )}

              <button
                onClick={() => handleDelete(car)}
                className="delete-button manage-button"
              >
                DELETE
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Cars;
