-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, phone, email, is_admin)
VALUES  ('diogobotelho',
         '$2b$12$XBq75DYu9Ly0qkTwBENIXuKa4kNrmNP5GVcLGsTEi9OjVBd2s0Y9C',
         'Diogo',
         'Botelho', 
         '1234567890', 
         'test@email.com',
         TRUE),
        ('samau',
         '$2b$12$XBq75DYu9Ly0qkTwBENIXuKa4kNrmNP5GVcLGsTEi9OjVBd2s0Y9C', 
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

