Journey for existing users:
-User has an account, wants to create a busker account.
-This should happen from the user personal section (1).
-There should be a button(2) to add a busker.
-When button is pressed, drop down form to create busker (3).
-When form submitted, busker is created (4), and busker account shows up in user
personal page (5), similar to EventList(?)

Journey for new users:
-When registering a new user, registration form has a checkmark (6)(7) "Do you also
want to create a busker account?"
-If checkmark is checked, the fields for registering a busker show (6)(7).


Things we need to build/refactor:
(1) User personal section
(2) Button to load busker registration form
(3) Busker registration form
(4) Create functions in BuskApi to make API call to busker registration route.
(5) Create BuskerList component
(6) Refactor user registration form to include checkmark and busker form fields.
(7) Refactor backend user registration route to check if busker registration
checkmark was ticked, in which case calls the busker registration function.