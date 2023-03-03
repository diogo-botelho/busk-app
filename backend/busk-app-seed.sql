INSERT INTO users (username, first_name, last_name, phone, email)
VALUES  ('diogobotelho',
         'password',
         'Diogo',
         'Botelho', 
         '1234567890', 
         'test@email.com',
         TRUE),
        ('samau',
         'password', 
         'Sammy',
         'Au', 
         '11111111',
         'test2@email.com',
         TRUE);

INSERT INTO buskers (userId, type)
VALUES (1, 'musician');

INSERT INTO events (busker_id, title, type,coordinates)
VALUES (1,
        'Diogo rocks in Central Park', 
        'concert',
        '{"lat":40.77848305406739,"lng":-73.96902361328482}');

