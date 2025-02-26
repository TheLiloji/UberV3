import express from 'express';
import MenuController from '../controllers/menuController.js';

const setMenuRoutes = (app) => {
  app.get('/menu', (req, res) => {
    const menuController = new MenuController();
    menuController.getMenu(req, res);
  });
};

export default setMenuRoutes;
