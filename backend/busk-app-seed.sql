-- both test users have the password "password"

INSERT INTO users (email, password, first_name, last_name, phone, is_admin)
VALUES  ('diogo@email.com',
         '$2b$12$XBq75DYu9Ly0qkTwBENIXuKa4kNrmNP5GVcLGsTEi9OjVBd2s0Y9C',
         'Diogo',
         'Botelho', 
         '1234567890', 
         TRUE),
        ('samau@email.com',
         '$2b$12$XBq75DYu9Ly0qkTwBENIXuKa4kNrmNP5GVcLGsTEi9OjVBd2s0Y9C', 
         'Sammy',
         'Au', 
         '11111111',
         TRUE);

INSERT INTO buskers (user_id, busker_name, category, description)
VALUES (1, 'Saxiogo', 'musician', 'Diogo plays saxophone in the park.');

INSERT INTO events (busker_id, title, type,coordinates)
VALUES (1,
        'Diogo rocks in Central Park', 
        'concert',
        '{"lat":40.77848305406739,"lng":-73.96902361328482}');

