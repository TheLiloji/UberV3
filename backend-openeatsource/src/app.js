import express from 'express';
import bodyParser from 'body-parser';
import setRestaurantRoutes from './routes/restaurantRoutes.js';
import setMenuRoutes from './routes/menuRoutes.js';
import setAuthRoutes from './routes/authRoutes.js';
import setAddressRoutes from './routes/addressRoutes.js';
import setPaymentRoutes from './routes/paymentRoutes.js';
import setOrderRoutes from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the UberEats Backend API');
});

setMenuRoutes(app);
setRestaurantRoutes(app);
setAuthRoutes(app);
setAddressRoutes(app);
setPaymentRoutes(app);
setOrderRoutes(app);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});