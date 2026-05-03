CREATE TABLE Publisher (
    publisher_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    YearOfPublication INT
);
CREATE TABLE Books (
    ISBN VARCHAR(20) PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Edition VARCHAR(50),
    Category VARCHAR(100),
    Price DECIMAL(10, 2),
    AuthNo VARCHAR(100),
    Quantity INT DEFAULT 0,
    publisher_id INT,
    FOREIGN KEY (publisher_id) REFERENCES Publisher(publisher_id)
);
CREATE TABLE Staff (
    staff_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
CREATE TABLE Authentication_system (
    Loginid VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL,
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);
CREATE TABLE Readers (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    Firstname VARCHAR(100),
    Lastname VARCHAR(100),
    Email VARCHAR(150),
    Address TEXT,
    Phone_no VARCHAR(20)
);
CREATE TABLE Reserve_Return_Date (
    id INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    ISBN VARCHAR(20),
    ReverseDate DATE,
    return_date DATE,
    FOREIGN KEY (User_ID) REFERENCES Readers(User_ID),
    FOREIGN KEY (ISBN) REFERENCES Books(ISBN)
);
CREATE TABLE Reports (
    Reg_no INT PRIMARY KEY AUTO_INCREMENT,
    Book_No VARCHAR(20),
    User_id INT,
    Issue_Return VARCHAR(50),
    staff_id INT,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);
