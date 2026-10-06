CREATE TABLE inv (
  name VARCHAR(255),
  brand VARCHAR(50),
  quantity INT,
  price DECIMAL(19, 2)
);


INSERT INTO inv (name, brand, quantity, price)
VALUES ('iPhone 14 Pro', 'Apple', 10, 999.99),
       ('Galaxy S23 Ultra', 'Samsung', 15, 1199.99),
       ('Pixel 7 Pro', 'Google', 8, 899.99),
       ('Xperia 1 IV', 'Sony', 7, 1299.99);
