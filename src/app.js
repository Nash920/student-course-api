const express = require('express');
const swaggerUi = require('swagger-ui-express');

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');
const swaggerDocument = require('../swagger.json');
const storage = require('./services/storage');

const app = express();

app.use(express.json());

// Seed des données au démarrage
storage.seed();

// Swagger UI (à partir de swagger.json)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes principales
app.use('/students', studentsRouter);
app.use('/courses', coursesRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Middleware d'erreur
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
