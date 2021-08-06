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



// add jf route start



// jobfair

Route::resource('/jf-list', JFListController::class);
Route::get('/jf-list', 'JFListController@index');
Route::get('/jf-list/delete/{id}', 'JFListController@destroy');

Route::post('/is-jf-existed', [JobfairController::class, 'checkNameExisted']);
Route::resource('/jobfair', 'JobfairController');

// schedule

Route::resource('/schedules', 'ScheduleController');
Route::get('/schedules/{id}/milestones', 'ScheduleController@getMilestones');
Route::get('/schedules/{id}/tasks', 'ScheduleController@getTasks');
Route::prefix('schedule')->group(function () {
    Route::get('/', 'ScheduleController@getAll');
    Route::get('/search', 'ScheduleController@search');
});

Route::get('/admins', 'AdminController@index');

Route::group(['prefix' => 'jobfair/{id}'], function () {
    Route::get('/milestones', 'JobfairController@getMilestones');
    Route::get('/tasks', 'JobfairController@getTasks');
    Route::get('/updated-tasks', 'JobfairController@updatedTasks');
    Route::get('/tasks/search', 'JobfairController@searchTask');
    Route::post('/jobfair', 'JobfairController@store');
});

//milestone

Route::resource('/milestone', TemplateMilestoneController::class);

Route::get('/milestone/search', 'TemplateMilestoneController@getSearch');
Route::get('/milestone', 'TemplateMilestoneController@getList');
Route::get('/milestone/delete/{id}', 'TemplateMilestoneController@destroyMilestone');

//member

Route::prefix('member')->group(function () {
    Route::get('/', 'MemberController@index');

    Route::get('/{id}', 'MemberController@showMember');
    Route::patch('/{id}/update', 'MemberController@update');
});

// login, logout

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/reset-password', [ResetPasswordController::class, 'handleRequest']);
Route::post('/update-password', [ResetPasswordController::class, 'updatePassword']);

Route::resource('/jf-list', JFListController::class);
Route::get('/jf-list', 'JFListController@index');
Route::get('/jf-list/delete/{id}', 'JFListController@destroy');

Route::get('/jf-schedule/{id}', 'ScheduleController@getScheduleb');

//template-task
Route::resource('/template-tasks', 'TemplateTaskController');
Route::get('/categories-template-tasks', 'TemplateTaskController@getCategoriesTasks');
Route::get('/before-template-tasks/{id}', 'TemplateTaskController@getBeforeTasks');
Route::get('/after-template-tasks/{id}', 'TemplateTaskController@getAfterTasks');


//category

Route::prefix('category')->group(function () {
    Route::get('/', 'CategoryController@index');
});


Route::resource('/profile', ProfileController::class);
// Route::resource('/profile/avatar', [ProfileController::class, 'getAvatar']);

Route::get('/check-unique-edit/{id}/{name}', [App\Http\Controllers\TemplateMilestoneController::class, 'checkUniqueEdit']);
Route::get('/check-unique-add/{name}', [App\Http\Controllers\TemplateMilestoneController::class, 'checkUniqueAdd']);
