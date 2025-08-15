-- If your compose sets MYSQL_DATABASE, omit USE. Otherwise uncomment:
-- USE phy_web;

-- Quizzes
INSERT INTO quizzes (slug, title, className, description) VALUES
('pendulum',      'Simple Pendulum',      'pendulum',      '4 questions to test your knowledge'),
('gravitational', 'Gravitational Field',  'gravitational', '3 questions to test your knowledge'),
('magnetic',      'Magnetic Field',       'magnetic',      '4 questions to test your knowledge');

-- =======================
-- PENDULUM (quiz_id = 1)
-- =======================

-- Q1
INSERT INTO questions (quiz_id, text)
VALUES (1, 'What is the condition of Simple Harmonic Motion?');
SET @q1 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@q1, 'Acceleration is directly proportional to displacement and opposite in direction', 1),
(@q1, 'Acceleration is constant', 0),
(@q1, 'Displacement is zero', 0),
(@q1, 'Motion is in a straight line', 0);

-- Q2
INSERT INTO questions (quiz_id, text)
VALUES (1, 'What is the formula for the time period of a simple pendulum?');
SET @q2 := LAST_INSERT_ID();

-- Use ASCII-only: 2*pi*sqrt(l/g), etc.
INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@q2, 'T = 2*pi*sqrt(l/g)', 1),
(@q2, 'T = 2*pi*sqrt(g/l)', 0),
(@q2, 'T = g/(2*pi*l)',     0),
(@q2, 'T = 2*l/(pi*g)',     0);

-- Q3
INSERT INTO questions (quiz_id, text)
VALUES (1, 'A swing is 200 cm long. What is the time period?');
SET @q3 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@q3, '2.84 s', 1),
(@q3, '1.40 s', 0),
(@q3, '3.20 s', 0),
(@q3, '0.98 s', 0);

-- Q4
INSERT INTO questions (quiz_id, text)
VALUES (1, 'What is the equation of SHM?');
SET @q4 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@q4, 'a = -omega^2 * x', 1),
(@q4, 'a = omega * x',    0),
(@q4, 'a = omega^2 * x',  0),
(@q4, 'a = -x',           0);

-- ===========================
-- GRAVITATIONAL (quiz_id = 2)
-- ===========================

-- Q1
INSERT INTO questions (quiz_id, text)
VALUES (2, 'What is the formula for gravitational force?');
SET @g1 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@g1, 'F = G*m1*m2/r^2', 1),
(@g1, 'F = G*m1/r',      0),
(@g1, 'F = (m1*m2)/(G*r)', 0),
(@g1, 'F = G*r^2*m',     0);

-- Q2
INSERT INTO questions (quiz_id, text)
VALUES (2, 'What is the formula for linear speed of a satellite?');
SET @g2 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@g2, 'v^2 = G*M/r', 1),
(@g2, 'v = G*M*r^2', 0),
(@g2, 'v = r/(G*M)', 0),
(@g2, 'v = G*M/r^2', 0);

-- Q3
INSERT INTO questions (quiz_id, text)
VALUES (2, 'Gravitational force between Earth (5.97e24 kg) and Mars (6.42e23 kg) at distance ~7.5e10 m is:');
SET @g3 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@g3, '4.54e16 N', 1),
(@g3, '1.20e17 N', 0),
(@g3, '2.50e16 N', 0),
(@g3, '6.30e15 N', 0);

-- ======================
-- MAGNETIC (quiz_id = 3)
-- ======================

-- Q1
INSERT INTO questions (quiz_id, text)
VALUES (3, 'Magnetic force depends on:');
SET @m1 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@m1, 'Magnetic field (B), current (I), length of conductor (L)', 1),
(@m1, 'Voltage, charge, mass', 0),
(@m1, 'Area, gravity, frequency', 0),
(@m1, 'Temperature, resistance, density', 0);

-- Q2
INSERT INTO questions (quiz_id, text)
VALUES (3, 'Calculate the force when B = 0.5 T, I = 2 A, L = 1.5 m');
SET @m2 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@m2, 'F = B*I*L = 0.5*2*1.5 = 1.5 N', 1),
(@m2, '3.0 N',  0),
(@m2, '0.5 N',  0),
(@m2, '2.5 N',  0);

-- Q3
INSERT INTO questions (quiz_id, text)
VALUES (3, 'What does Lenz''s law state?');
SET @m3 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@m3, 'The direction of induced current opposes the change that produced it', 1),
(@m3, 'Current flows in the direction of the magnetic field', 0),
(@m3, 'Magnetic field always aligns with current', 0),
(@m3, 'Induced current enhances the change producing it', 0);

-- Q4
INSERT INTO questions (quiz_id, text)
VALUES (3, 'What is Faraday''s law?');
SET @m4 := LAST_INSERT_ID();

INSERT INTO answers (question_id, option_text, is_correct) VALUES
(@m4, 'Induced EMF is proportional to the rate of change of magnetic flux', 1),
(@m4, 'Induced current flows from high to low potential', 0),
(@m4, 'Flux is always constant', 0),
(@m4, 'EMF is independent of flux changes', 0);
