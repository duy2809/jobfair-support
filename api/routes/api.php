<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResetPasswordController;
use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\TemplateMilestoneController;

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
Route::resource('/jobfair', 'JobfairController');
Route::group(['prefix' => 'jobfair/{id}'], function () {
    Route::get('/milestones', 'JobfairController@getMilestones');
    Route::get('/tasks', 'JobfairController@getTasks');
    Route::get('/updated-tasks', 'JobfairController@updatedTasks');
    Route::get('/tasks/search', 'JobfairController@searchTask');
});

Route::resource('/milestone', TemplateMilestoneController::class);
Route::get('/check-unique-edit/{id}/{name}', [App\Http\Controllers\TemplateMilestoneController::class, 'checkUniqueEdit']);
Route::get('/check-unique-add/{name}', [App\Http\Controllers\TemplateMilestoneController::class, 'checkUniqueAdd']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/reset-password', [ResetPasswordController::class, 'handleRequest']);
Route::post('/update-password', [ResetPasswordController::class, 'updatePassword']);
Route::resource('/profile', ProfileController::class);
