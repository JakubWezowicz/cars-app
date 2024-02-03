import "./CarForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCars } from "../../redux/cars";
const CarForm = ({ setError, setData, setShowForm }) => {
  const dispatch = useDispatch();
  const { carsData } = useSelector((state) => state.cars);
  const addCar = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/cars", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Brand: car.Brand,
        Model: car.Model,
        Year: car.Year,
      }),
    });
    const data = await response.json();
    if (carsData) {
      dispatch(setCars([...carsData, { ...car, ID: data }]));
    } else {
      dispatch(setCars([{ ...car, ID: data }]));
    }
    setShowForm(false);
    setCar({
      Brand: "",
      Model: "",
      Year: 0,
    });
  };
  const [car, setCar] = useState({
    Brand: "",
    Model: "",
    Year: 0,
  });
  return (
    <div className="car-form">
      <form onSubmit={addCar}>
        <label>Car Brand:</label>
        <input
          type="text"
          required
          onChange={(e) => setCar({ ...car, Brand: e.target.value })}
          value={car.Brand}
        />
        <label>Car Model:</label>
        <input
          type="text"
          required
          onChange={(e) => setCar({ ...car, Model: e.target.value })}
          value={car.Model}
        />
        <label>Car Year:</label>
        <input
          type="number"
          required
          onChange={(e) => setCar({ ...car, Year: parseInt(e.target.value) })}
          value={car.Year}
        />
        <input type="submit" value="Dodaj auto" />
      </form>
    </div>
  );
};

export default CarForm;
