import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./App.css";
import Modal from "./components/Modal";
import CarForm from "./components/CarForm";
import SearchBar from "./components/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { setCars } from "./redux/cars";
import Cars from "./components/Cars";

function App() {
  // redux testing
  const dispatch = useDispatch();
  const { carsData } = useSelector((state) => state.cars);

  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/cars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => dispatch(setCars(data)))
      .then(() => setIsLoading(false))
      .catch((err) => setError(err.message));
  }, []);
  useEffect(() => {
    console.log(carsData);
  }, [carsData]);

  return (
    <>
      <h1>Car info app</h1>
      <SearchBar setError={setError} setIsLoading={setIsLoading} />
      {isLoading && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Cars
        setMousePosition={setMousePosition}
        setShowModal={setShowModal}
        showModal={showModal}
        setCurrentCar={setCurrentCar}
        setError={setError}
      />
      <button onClick={() => setShowForm((prev) => !prev)}>Add New Car</button>
      {showForm && <CarForm setError={setError} setShowForm={setShowForm} />}
      {showModal &&
        createPortal(
          <Modal car={currentCar} mousePosition={mousePosition} />,
          document.body
        )}
    </>
  );
}

export default App;
