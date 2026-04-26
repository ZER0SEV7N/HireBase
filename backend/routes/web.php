<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/storage/profiles/{filename}', function ($filename) {
    $path = storage_path('app/public/profiles/' . $filename);

    if (!file_exists($path)) abort(404);
    

    return response()->file($path);
});

Route::get('/storage/cvs/{filename}', function ($filename) {
    $path = storage_path('app/public/cvs/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});