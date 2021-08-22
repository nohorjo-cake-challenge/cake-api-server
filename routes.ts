import { Router } from 'express';

import cakesDAO from './cakesDAO';

const route = Router();

route.get('/all', (req, resp) => {
  cakesDAO.getAllCakes().then(cakes => {
    resp.send(cakes);
  }).catch(err => {
    console.error(err);

    resp.sendStatus(500);
  });
});

route.post('/new', (req, resp) => {
  cakesDAO.addCake(req.body).then(id => {
    resp.status(201).send(String(id));
  }).catch(err => {
    if (err.message === 'Invalid cake') {
      resp.status(400).send('Request body must contain valid name, comment, imageUrl and yumFactor values');
    } else {
      console.error(err);

      resp.sendStatus(500);
    }
  });
});

route.delete('/:id', (req, resp) => {
  const id = parseInt(req.params.id);

  cakesDAO.deleteCake(id).then(() => {
    resp.sendStatus(204);
  }).catch(err => {
    if (err.message === 'Cake not found') {
      resp.status(404).send(`Cake with id [${id}] not found`);
    } else {
      console.error(err);

      resp.sendStatus(500);
    }
  });
});

export default route;
