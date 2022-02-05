import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationForm({error, handleChange, handleSubmit, formData,}) {
  const history = useHistory();


  return (
    <div>
      <ErrorAlert error={error} />
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

export default ReservationForm;