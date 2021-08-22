import { ICake } from 'cake-common';
import request from 'supertest';

import cakesDAO from './cakesDAO';

import app from './server';

jest.mock('./cakesDAO');

const mockDAO = cakesDAO as jest.Mocked<typeof cakesDAO>;

describe('get all cakes', () => {
  it('should return all cakes', done => {
    const cakes = [{name: 'cake'}] as ICake[];
    mockDAO.getAllCakes.mockResolvedValueOnce(cakes);

    request(app)
      .get('/all')
      .expect(200, cakes, done);
  });

  it('should return 500 on errors', done => {
    mockDAO.getAllCakes.mockRejectedValueOnce(null);

    request(app)
      .get('/all')
      .expect(500, done);
  });
});

describe('create cakes', () => {
  it('should create cake', done => {
    const newCake = {name: 'new'};
    mockDAO.addCake.mockResolvedValueOnce(1);

    request(app)
      .post('/new')
      .send(newCake)
      .set('Accept', 'application/json')
      .expect(201, '1')
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        expect(mockDAO.addCake).toHaveBeenLastCalledWith(newCake);
        done();
      });
  });

  it('should return 400 on invalid', done => {
    mockDAO.addCake.mockRejectedValueOnce(new Error('Invalid cake'));

    request(app)
      .post('/new')
      .set('Accept', 'application/json')
      .expect(400, 'Request body must contain valid name, comment, imageUrl and yumFactor values', done);
  });

  it('should return 500 on error', done => {
    mockDAO.addCake.mockRejectedValueOnce(new Error());

    request(app)
      .post('/new')
      .set('Accept', 'application/json')
      .expect(500, done);
  });
});

describe('delete cake', () => {
  it('should delete cake', done => {
    mockDAO.deleteCake.mockResolvedValueOnce();

    const id = 1;

    request(app)
      .delete(`/${id}`)
      .expect(204)
      .end(err => {
        if (err) {
          done(err);
          return;
        }
        expect(mockDAO.deleteCake).toHaveBeenLastCalledWith(id);
        done();
      });
  });

  it('should return 404 on invalid id', done => {
    mockDAO.deleteCake.mockRejectedValueOnce(new Error('Cake not found'));

    request(app)
      .delete('/1')
      .expect(404, 'Cake with id [1] not found', done);
  });

  it('should return 500 on error', done => {
    mockDAO.deleteCake.mockRejectedValueOnce(new Error());

    request(app)
      .delete('/1')
      .expect(500, done);
  });
});
