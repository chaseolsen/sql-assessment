select make, model, year from users
join vehicles
on users.id = vehicles.id
WHERE year > 2000
ORDER BY year DESC
