/**
 * Component for the /reservations/new path
 * Displays the ReservationForm component
 * Allows the user to create a new reservation
 *
 */

import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function CreateNewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [error, setError] = useState(null);
  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormState });

  async function handleSubmit(event) {
    event.preventDefault();
    const ac = new AbortController();
    setError(null);
    try {
      await createReservation(
        { ...formData, people: Number(formData.people) },
        ac.signal
      );
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setError(error);
    }

    return () => ac.abort();
  }

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  return (
    <div>
      <h1 style={{color:"#284b63"}}>Create A New Reservation</h1>
      <ReservationForm
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
      />
    </div>
  );
}

export default CreateNewReservation;
