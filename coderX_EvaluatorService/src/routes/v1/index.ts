import express from 'express';
import { pingCheck } from '../../controllers/ping.controller';
const V1Router = express.Router();

V1Router.get('/ping-check', pingCheck);

export default V1Router;
