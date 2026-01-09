CREATE DATABASE IF NOT EXISTS student_management;

USE student_management;

CREATE TABLE students (
  id VARCHAR(255) PRIMARY KEY,
  regNumber VARCHAR(255),
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  gender ENUM('M', 'F'),
  dob DATE,
  level ENUM('PRIMARY', 'JHS'),
  gradeLevel VARCHAR(255),
  parentName VARCHAR(255),
  parentPhone VARCHAR(255),
  status ENUM('active', 'graduated', 'inactive'),
  photo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role ENUM('ADMIN', 'TEACHER'),
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add more tables as needed for attendance, academics, etc.