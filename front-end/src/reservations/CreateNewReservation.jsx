import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

/*
allows the user to create a new reservation with the restaurant


- The path to this screen is /reservations/new
- A form is shown with the appropriate fields for creating a new reservation.
    -This includes: first & last name, mobile number, number of people and a dtop down to pick an appropriate date
- If the user clicks "submit":
    - the reservation is submitted & saved
    - then navigates to /dashboard & shows the users reservation
- If the user clicks "cancel", the user is taken to the previous page
*/

function CreateNewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const history = useHistory();

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
     createReservation({...formData, people: Number(formData.people)})
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(console.error);
      setFormData({ ...initialFormState });
  };


  return (
    <div>
      <h1>Create New Reservtion</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="first_name" className="col">
            <h4>First Name</h4>
            <input
              id="first_name"
              style={{ width: "100%" }}
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
          </label>
          <label htmlFor="last_name" className="col">
            <h4>Last Name</h4>
            <input
              id="last_name"
              style={{ width: "100%" }}
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </label>
          <label htmlFor="mobile_number" className="col">
            <h4>Mobile Number</h4>
            <input
              id="name"
              style={{ width: "100%" }}
              type="text"
              name="mobile_number"
              placeholder="xxx-xxx-xxxx"
              onChange={handleChange}
              value={formData.mobile_number}
              required
            />
          </label>
        </div>

        <div className="row">
          <label htmlFor="reservation_date" className="col">
            <h4>Date</h4>
            <input
              id="reservation_date"
              style={{ width: "100%" }}
              type="date"
              name="reservation_date"
              pattern="\d{4}-\d{2}-\d{2}"
              onChange={handleChange}
              value={formData.reservation_date}
              required
            />
          </label>
          <label htmlFor="reservation_time" className="col">
            <h4>Time</h4>
            <input
              id="reservation_time"
              style={{ width: "100%" }}
              type="time"
              name="reservation_time"
              pattern="[0-9]{2}:[0-9]{2}"
              onChange={handleChange}
              value={formData.reservation_time}
              required
            />
          </label>
          <label htmlFor="people" className="col">
            <h4>Party Size</h4>
            <input
              id="people"
              style={{ width: "100%" }}
              type="number"
              name="people"
              min={1}
              onChange={handleChange}
              value={formData.people}
              required
            />
          </label>
        </div>

        <div>
          <button type="submit" className="btn btn-primary m-2">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary m-2"
            onClick={() => history.push("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewReservation;
