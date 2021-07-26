<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/web-init', WebInit::class);
Route::resource('/milestone', MilestoneController::class);
Route::get('/categories', [Controllers\CategoryController::class, 'index'])
    ->name('categories.index');
Route::get('/categories/{key}', [Controllers\CategoryController::class, 'search'])
    ->name('categories.search');
