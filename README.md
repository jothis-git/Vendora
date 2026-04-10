# 🛒 Vendora – Full-Stack E-Commerce Platform

Vendora is a **full-stack e-commerce application** that enables users to browse products, place orders, and complete payments, while providing administrative control for managing products and orders.

---

## 🚀 Features

* 🔐 JWT-based Authentication (with token expiration)
* 🛡️ Role-Based Access Control (Admin / Customer)
* 🛍️ Product Management (CRUD operations)
* 📦 Order Management System
* 💳 Razorpay Payment Integration (Test Mode)
* 🌐 REST API integration with React frontend (AI-assisted development)
* 📊 Scalable layered architecture
* 🐳 Docker containerized backend

---

## 🧱 Tech Stack

### 🔹 Backend

* Java
* Spring Boot
* REST APIs
* Hibernate / JPA
* MySQL

### 🔹 Frontend

* React.js
* HTML, CSS, JavaScript
* AI-assisted UI development

### 🔹 Tools & Deployment

* Git & GitHub
* Docker
* MySQL Workbench

---

## 🏗️ Architecture

The application follows a **layered architecture**:

* **Controller Layer** → Handles HTTP requests
* **Service Layer** → Business logic
* **Repository Layer** → Database operations
* **Database Layer** → MySQL

---

## 🔐 Authentication & Security

* Implemented **JWT (JSON Web Token) authentication**
* Token is generated on login with **expiration time**
* Each protected API validates the token

### 🛡️ Role-Based Access Control

#### **Admin**

* Manage products (Add / Update / Delete)
* View all orders
* Cannot purchase products

#### **Customer**

* Browse products
* Place orders
* Make payments

---

## 💳 Payment Integration

* Integrated **Razorpay (Test Mode)**
* Backend creates **payment orders**
* Handles **payment success and failure responses**
* Easily extendable to live payment environment

---

## 🔄 Application Flow

1. User interacts with the **React frontend**
2. Requests are sent to **Spring Boot REST APIs**
3. Business logic is handled in the service layer
4. Data is stored/retrieved from **MySQL database**
5. Response is returned to the frontend

---

## ⚙️ Setup Instructions

### 🔹 Clone Repository

```bash
git clone https://github.com/jothis-git/vendora.git
cd vendora
```

---

### 🔹 Backend Setup (Spring Boot)

```bash
cd vendora
```

#### Configure `application.properties`

Update the following values:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vendora
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

jwt.secret=your_jwt_secret_key

razorpay.key_id=your_razorpay_key_id
razorpay.key_secret=your_razorpay_key_secret
```

#### Run Backend

```bash
mvn spring-boot:run
```

---

### 🔹 Frontend Setup (React)

```bash
cd ../vendora-frontend
npm install
npm run dev
```

👉 Frontend runs on: **http://localhost:5173**

---

## 🐳 Docker

### Build Image

```bash
docker build -t vendora-app .
```

### Run Container

```bash
docker run -d -p 8080:8080 --name vendora-app-container vendora-app
```

### View Logs

```bash
docker logs vendora-app-container
```

👉 Backend runs on: **http://localhost:8080**

---

## 📌 Notes

* Razorpay integration is currently in **test mode**
* Designed with scalability and security best practices

---

## 📈 Future Enhancements

* JWT Refresh Tokens
* Order tracking system
* Admin dashboard improvements
* Cloud deployment (AWS / Render)

---

## 👨‍💻 Author

**Jyothis Paul**
📧 [jyothispaul046@gmail.com](mailto:jyothispaul046@gmail.com)
🔗 https://linkedin.com/in/jyothis-paul

---

## ⭐ License

This project is open-source and available under the MIT License.
