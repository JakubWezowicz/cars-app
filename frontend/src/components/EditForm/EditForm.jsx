import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCars } from "../../redux/cars";
import "./EditForm.css";

const EditForm = ({ car, setEditing }) => {
  const { carsData } = useSelector((state) => state.cars);
  const dispatch = useDispatch();
  const [changedCar, setChangedCar] = useState(car);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/cars/${car.ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...changedCar, task: "changeDetails" }),
      });
      dispatch(
        setCars(
          carsData.map((item) => (item.ID === car.ID ? changedCar : item))
        )
      );
      setEditing((prev) => ({ ...prev, edit: false }));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(car);
  }, [car]);
  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="brand"
          onChange={(e) =>
            setChangedCar((prev) => ({ ...prev, Brand: e.target.value }))
          }
          placeholder="Brand"
        />
        <input
          type="text"
          id="model"
          onChange={(e) =>
            setChangedCar((prev) => ({ ...prev, Model: e.target.value }))
          }
          placeholder="Model"
        />
        <input
          type="number"
          id="year"
          onChange={(e) =>
            setChangedCar((prev) => ({
              ...prev,
              Year: parseInt(e.target.value),
            }))
          }
          placeholder="Year"
        />
        <input type="submit" value="Zmień" />
      </form>
    </div>
  );
};

export default EditForm;
