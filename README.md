# Restaurant Reservation Manager

[Restaurant Reservation Manager](https://rest-manage-frontend.herokuapp.com/dashboard)

## Description
> The Restaurant Reservations Manager is an application built for both small and large restaurants to help the staff become more organized during the busiest of times. Giving staff more time to focus on providing customers with a stellar restaurant experience.
> With the manager staff can view, create, edit, seat, finish and cancel reservations, as well as create tables.

## Technology used

### Frontend
- JavaScript
- React
- CSS
- HTML
- Bootstrap


### Backend
- Node.js
- Express.js
- Knex


### Database
- PostgreSQL (hosted on ElephantSQL)


### Deployment
- Heroku


## Screenshots

### Dashboard
![Dashboard Page](README-imgs/dashboard.png?raw=true "Dashboard")
> Displays a table of reservations. Allows the user to look at previous, current, and future reservations, listed in chronological order. The reservations table also allows the user to seat, edit and cancel a reservation.
> Displays a table for current tables. The tables table has the option to finish a reservation and open the table up to a new reservation.


### Create a New Reservation
![Create a New Reservation Page](README-imgs/new-reservation.png?raw=true "Create a New Reservation")
> Allows the user to create a new reservation. A new reservation requires a first name, last name, mobile number, time, date, and party size. Reservations can not be on a Tuesday and must be within the business hours of the restaurant.


### Edit a Reservation
![Edit a Reservation Page](README-imgs/edit-reservation.png?raw=true "Edit a Reservation")
> Allows the user to edit any of the fields of an existing reservation.


### Seat a Reservation
![Seat a Reservation Page](README-imgs/seat-reservation.png?raw=true "Seat a Reservation")
> Allows the user to seat a reservation at a table that has the capacity for the reservation's party size.


### Search Reservations
![Search Reservations Page](README-imgs/search.png?raw=true "Search Reservations")
> Allows the user to search all reservations (booked, seated, finished, canceled) by the entire or partial mobile number.


### Create a New Table
![Create a New Table Page](README-imgs/new-table.png?raw=true "Create a New Table")
> Allows the user to create a new table, the required fields are a table name and a table capacity.


## Installation Instructions
1. Clone repository and `cd` into the root directory
2. Run `npm install`
3. Run `npm start` to start the front and back end concurrently