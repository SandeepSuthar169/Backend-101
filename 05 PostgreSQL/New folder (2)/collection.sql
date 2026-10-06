-- CREATE TABLE inventories (
--     name VARCHAR(255),
--     brand VARCHAR(50),
--     quantity INT,
--     price DECIMAL(19, 2)
-- );

INSERT INTO inventories (name, brand, quantity, price)
VALUES
    ('G15 laptop', 'Dell', 9, 200.99),
    ('I Phone 16', 'Iphone', 8, 200.99),
    ('A18', 'Samsung', 7, 200.99),
    ('A18', 'Samsung', 7, 200.99),


--1.  Create student regisgter table
CREATE TABLE studentRegister (
    studentName VARCHAR(255),
    class INT,
    subjectCount INTEGER,
    classRank VARCHAR(50),
    pass BOOLEAN
);

-- -------------------------------------------------------

-- 2.  Add produts to the products table 
INSERT INTO products (name, brand, count, price)
VALUES 
    ('keyboard', 'HP', 5, 499.99),
    ('monitor', 'Dell', 3, 8999.99),
    ('notebook', 'Classmate', 20, 45.50),
    ('pen', 'Cello', 50, 10.00),
    ('marker', 'Camlin', 15, 35.00),
    ('sharpener', 'Nataraj', 10, 8.50),
    ('ruler', 'Camlin', 12, 20.00),
    ('stapler', 'Kangaro', 6, 75.99),
    ('scissors', 'Kangaro', 4, 120.50),
    ('calculator', 'Casio', 7, 599.99),
    ('headphones', 'Boat', 8, 799.99),
    ('speaker', 'JBL', 4, 2499.99);


-- -------------------------------------------------------

-- 3.  Show all produts in terminal 
SELECT * FROM products

-- -------------------------------------------------------

-- 4. show only produtc name and count from produts table
SELECT name, count 
FROM products

-- -------------------------------------------------------

-- 5. count * price = total coust fo product
SELECT name, count * price
FROM products

-- -------------------------------------------------------

-- 6. total_coust  = count * price
SELECT 
    name, 
    price * count AS total_cost
FROM products 


------------------------------------


SELECT 
    name AS product_name, 
    price * count AS total_coust
FROM products 



-- -------------------------------------------------------


-- 7. add value 
SELECT 
    CONCAT(name, ' - ', brand) AS product_info
FROM products


-- -------------------------------------------------------

SELECT 
    CONCAT(name,' ', brand ,' ', 'total is =>' ,' ', count ,' ', 'price is ->', price)
FROM products


---------------------------------------------------------



SELECT 
    CONCAT_WS(' ', name, brand, price) AS info
FROM products

-----------------------------------------------------------

SELECT 
    id,
    name,
    brand,
    price
FROM userProduct
WHERE price BETWEEN 500.0 AND  9000.0;

------------------------------------------------------------

SELECT 
    id,
    name,
    brand,
    price
FROM userProduct
WHERE price NOT BETWEEN 500.0 AND  9000.0;


------------------------------------------------------------


SELECT 
    name AS product_name,
    brand AS brand_name,
    price
FROM userProduct
WHERE brand IN ('HP', 'Cello')



-----------------------------------------------------------


UPDATE inv
SET name = 'Phone 14 Pro-Max'
WHERE name = 'iPhone 14 Pro'
RETURNING *;


--------------------------------------------------------------