import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FuelSync Hub API',
    version: '1.0.0',
    description: 'Multi-tenant ERP system for fuel station management'
  },
  servers: [{ url: '/api', description: 'Development server' }],
  paths: {
    '/v1/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        responses: { 200: { description: 'Login successful' } }
      }
    }
  }
};

const router = Router();

router.get('/swagger.json', (_req, res) => {
  res.json(swaggerSpec);
});
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
