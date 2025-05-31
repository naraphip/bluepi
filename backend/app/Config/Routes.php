<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->setDefaultNamespace('App\Controllers');
$routes->set404Override();
$routes->setAutoRoute(true);

$routes->group('api', function ($routes) {
    $routes->get('auth/token', 'Authen::token');
    $routes->post('auth/validate', 'Authen::validateToken');
});

$routes->group('api', ['filter' => 'auth'], function ($routes) {
    // product
    $routes->get('products', 'Product::index');
    // $routes->get('product/(:num)', 'Product::show/$1');

    // payment
    $routes->post('payment/checkout', 'Payment::checkout');

    // booking 
    $routes->post('booking', 'Booking::make_booking');
    $routes->post('booking/detail', 'Booking::booking_detail');

    // VendingMachine test
    $routes->post('vending/purchase', 'VendingMachine::purchase');
});