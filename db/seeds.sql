INSERT INTO department (id, department_name)
VALUES (111, "Sales"),
       (222, "Engineering"),
       (333, "Finance"),
       (444, "Legal");

INSERT INTO roles (id, title, salary, department_id)
VALUES (123, "Sales Lead", 100000, 111),
        (234, "Salesperson", 80000, 111),
        (345, "Lead Engineer", 150000, 222),
        (456, "Software Engineer", 120000, 222),
        (567, "Account Manager", 160000, 333),
        (678, "Accountant", 125000, 333),
        (789, "Legal Team Lead", 250000, 444),
        (890, "Lawyer", 190000, 444);
       
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (098, "Molly", "Garvens", 123, null),
        (987, "Tim", "Close", 234, 098),
        (876, "Austin", "Close", 345, null)
        (765, "Patrice", "Kise", 456, 876),
        (654, "George", "Close", 567, null),
        (543, "Jerry", "Close", 678, 654),
        (432, "Ann", "Lunik", 789, null),
        (321, "Maura", "O'Connor", 890, 432);