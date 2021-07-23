<?php

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
Route::prefix('member')->group(function () {
    Route::get('/', 'MemberController@index');
});

Route::prefix('schedule')->group(function () {
    Route::get('/', 'ScheduleController@index');
    Route::get('/search', 'ScheduleController@search');
});
