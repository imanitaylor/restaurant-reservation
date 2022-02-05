import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
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
      <h1>Create A New Reservation</h1>
      <ReservationForm error={error} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData}/>
    </div>
  );
}

export default CreateNewReservation;
