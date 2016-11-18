select make from users
join vehicles
on users.id = vehicles.id
where email = 'John@Smith.com'
