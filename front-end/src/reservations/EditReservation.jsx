import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation } from "../utils/api";
import { updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import formatReservationDate from "../utils/format-reservation-date";

function EditReservation() {
  const {reservation_id} = useParams();

  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(loadReservation,[reservation_id])

    function loadReservation(){
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
          .then(formatReservationDate)
          .then(setFormData)
          .catch(setError);
        return () => abortController.abort();
      }



  async function handleSubmit(event) {
    event.preventDefault();
    const ac = new AbortController();
    setError(null);
    try {
      await updateReservation(
        { ...formData,
          people: Number(formData.people) },
        ac.signal
      );
      history.push(`/dashboard?date=${formData.reservation_date}`)
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
      <h1>Edit Reservation</h1>
      <ReservationForm error={error} handleChange={handleChange} handleSubmit={handleSubmit} formData={formData}/>
    </div>
  );
}

export default EditReservation;
