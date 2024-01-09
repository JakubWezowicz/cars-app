import { useSelector, useDispatch } from "react-redux";
import Car from "../../assets/car_icon.png";
import { setCars } from "../../redux/cars";

const Cars = ({
  setMousePosition,
  setShowModal,
  showModal,
  setCurrentCar,
  setError,
}) => {
  const { carsData } = useSelector((state) => state.cars);
  const dispatch = useDispatch();
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
      body: JSON.stringify(changedCar),
    })
      .then((res) => {
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
        dispatch(setCars(newData));
        setShowModal(false);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="cars">
      <ul>
        {carsData &&
          carsData.map((car) => (
            <li key={car.ID}>
              <h3>
                {car.Brand} {car.Model}{" "}
              </h3>
              <img
                src={Car}
                alt="car"
                onMouseMove={handleMove}
                onMouseEnter={() => handleMouseEnter(car)}
                onMouseLeave={() => setShowModal(false)}
                onClick={() => editCar(car)}
              />
              <button
                onClick={() => handleDelete(car)}
                className="delete-button"
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
