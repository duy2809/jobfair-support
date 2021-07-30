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

Route::apiResource('/milestone', MilestoneController::class);

Route::apiResource('/category', CategoryController::class);

Route::get('/category/find/{key}', [App\Http\Controllers\CategoryController::class, 'search']);

Route::resource('/milestone', TemplateMilestoneController::class);