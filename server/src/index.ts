import express, { Response, Request } from 'express';

import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Middleware import
import { authMiddleware } from './middleware/authMiddleware';

// Routes import
import tenantRoutes from './routes/tenantRoutes';
import managerRoutes from './routes/managerRoutes';
import propertyRoutes from './routes/propertyRoutes';
import leaseRoutes from './routes/leaseRoutes';
import applicationRoutes from './routes/applicationRoutes';

// Configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('This is home route');
});

app.use('/tenants', authMiddleware(['tenant']), tenantRoutes);
app.use('/managers', authMiddleware(['manager']), managerRoutes);
app.use('/properties', propertyRoutes);
app.use('/leases', leaseRoutes);
app.use('/applications', applicationRoutes);

// Server
const port = Number(process.env.PORT) || 3002;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
