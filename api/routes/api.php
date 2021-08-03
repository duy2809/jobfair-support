<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobfairController;
use App\Http\Controllers\ResetPasswordController;
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
Route::resource('/jobfair', 'JobfairController');
Route::group(['prefix' => 'jobfair/{id}'], function () {
    Route::get('/milestones', 'JobfairController@getMilestones');
    Route::get('/tasks', 'JobfairController@getTasks');
    Route::get('/updated-tasks', 'JobfairController@updatedTasks');
    Route::get('/tasks/search', 'JobfairController@searchTask');
});
// add jf route start
Route::post('/is-jf-existed', [JobfairController::class, 'checkNameExisted']);
Route::resource('/jobfair', 'JobfairController');
Route::resource('/schedules', 'ScheduleController');
Route::get('/schedules/{id}/milestones', 'ScheduleController@getMilestones');
Route::get('/schedules/{id}/tasks', 'ScheduleController@getTasks');
Route::get('/admins', 'AdminController@index');

Route::group(['prefix' => 'jobfair/{id}'], function () {
    Route::get('/milestones', 'JobfairController@getMilestones');
    Route::get('/tasks', 'JobfairController@getTasks');
    Route::get('/updated-tasks', 'JobfairController@updatedTasks');
    Route::get('/tasks/search', 'JobfairController@searchTask');
    Route::get('/tasks/search', 'JobfairController@searchTask');
    Route::post('/jobfair', 'JobfairController@store');
});
//add JF route end

Route::resource('/milestone', TemplateMilestoneController::class);
Route::resource('/milestone', MilestoneController::class);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/reset-password', [ResetPasswordController::class, 'handleRequest']);
Route::post('/update-password', [ResetPasswordController::class, 'updatePassword']);

Route::get('/milestone/search', 'TemplateMilestoneController@getSearch');
Route::get('/milestone', 'TemplateMilestoneController@getList');
Route::get('/milestone/delete/{id}', 'TemplateMilestoneController@destroyMilestone');
