<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/roulette', 'Roulette\Main::index');
$routes->post('/api/roulette/run', 'Api\Roulette::run');
