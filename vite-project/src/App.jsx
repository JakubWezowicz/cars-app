import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./App.css";
import Modal from "./components/Modal";
import Car from "./assets/car_icon.png";
import CarForm from "./components/CarForm";
import SearchBar from "./components/SearchBar";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/cars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .then(() => setIsLoading(false))
      .catch((err) => setError(err.message));
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  const handleMouseEnter = (car) => {
    if (!showModal) {
      setShowModal(true);
    }
    setCurrentCar(car);
  };
  const handleMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  const editCar = (car) => {
    const changedCar = { ...car, Available: !car.Available };
    const newData = data.map((car) => {
      if (car.ID == changedCar.ID) {
        return changedCar;
      }
      return car;
    });
    fetch(`http://localhost:8080/api/cars/${car.ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changedCar),
    })
      .then((res) => {
        setData(newData);
        setCurrentCar(changedCar);
      })

      .catch((err) => setError(err.message));
  };
  const handleDelete = (car) => {
    const newData = data.filter((item) => item.ID !== car.ID);
    fetch(`http://localhost:8080/api/cars/${car.ID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setData(newData);
        setShowModal(false);
      })
      .catch((err) => setError(err.message));
  };
  return (
    <>
      <h1>Car info app</h1>
      <SearchBar
        setData={setData}
        setError={setError}
        setIsLoading={setIsLoading}
      />
      {isLoading && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {data &&
          data.map((car) => (
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
      <button onClick={() => setShowForm((prev) => !prev)}>Add New Car</button>
      {showForm && (
        <CarForm
          setError={setError}
          setData={setData}
          setShowForm={setShowForm}
        />
      )}
      {showModal &&
        createPortal(
          <Modal car={currentCar} mousePosition={mousePosition} />,
          document.body
        )}
    </>
  );
}

export default App;
