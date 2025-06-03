const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const session = require('express-session');
const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const { Skill } = require('./models'); // Adjust path if needed
require('dotenv').config();

const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { rollDice } = require('./controllers/diceController');

const startServer = async () => {
  const app = express();

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true
  }));

  app.use(cors({
    origin: 'http://localhost:9000', // Your Webpack dev server
    credentials: true
  }));
  app.use(json());
  app.use('/graphql', expressMiddleware(server));
  app.post('/api/roll-dice', rollDice);

  app.get('/api/skills', async (req, res) => {
    try {
      const skills = await Skill.findAll();
      res.json(skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/skills', async (req, res) => {
    console.log("POST /api/skills called with body:", req.body);
    try {
      const newSkill = await Skill.create(req.body);
      console.log("New skill created:", newSkill);
      res.status(201).json(newSkill);
    } catch (error) {
      console.error('Error creating skill:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });  

  // Start Express server
  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000/graphql');
  });
};

startServer();