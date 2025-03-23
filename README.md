# InstaCommerce

## How to view Swagger documentation

One time setup:

```sh
npm install -g swagger-ui-watcher
```

Later on:
```sh
swagger-ui-watcher --port <port> API.yml
```

## List of microservices:
User Management Service: Handles user authentication, registration, profile management, and access control.

Product Management Service: Combines Product Catalog Service and Inventory Service to manage product information, availability, and inventory levels.

Order Management Service: Manages the lifecycle of orders, including creating, updating, cancelling, tracking, and fulfilling orders.

Payment Service: Handles payment processing, including payment gateway integration, transaction management, and processing refunds if necessary.

Cart Service: Manages shopping carts for users, including adding/removing items, updating quantities, and calculating totals.

Shipping Service: Integrates with shipping carriers to calculate shipping costs, generate shipping labels, track shipments, and handle order fulfillment.

Notification Service: Sends notifications to users about order status updates, promotions, or other relevant events via email, SMS, or push notifications.

Reviews and Ratings Service: Manages customer reviews and ratings for products, as well as providing features like commenting and moderation.

Seller Management Service: Handles all aspects related to managing sellers on the platform, including seller registration, verification, profile management, and commission calculations.

## How to run the application:

### Run service-registry 
```
cd src/service-registry
npm i
npm start
```

### Run gateway server
```
cd src/gateway
npm i
npm start
```

### Run frontend
```
cd src/Frontend
npm i
npm run dev
```

Open `http://localhost:5173/`
