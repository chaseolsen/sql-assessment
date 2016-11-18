select make from users
join vehicles
on users.id = vehicles.id
WHERE firstname LIKE 'J%';
