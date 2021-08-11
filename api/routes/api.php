<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InviteMemberController;
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
// add jf route start

// jobfair

Route::resource('/jf-list', JFListController::class);
Route::get('/jf-list', 'JFListController@index');
Route::get('/jf-list/delete/{id}', 'JFListController@destroy');
Route::get('/jf-schedule/{id}', 'ScheduleController@getScheduleb');
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

//template-task

Route::resource('/template-tasks', 'TemplateTaskController');
Route::get('/categories-template-tasks', 'TemplateTaskController@getCategoriesTasks');
Route::get('/before-template-tasks/{id}', 'TemplateTaskController@getBeforeTasks');
Route::get('/after-template-tasks/{id}', 'TemplateTaskController@getAfterTasks');

//category
Route::apiResource('/category', CategoryController::class);
Route::get('/category/find/{key}', [App\Http\Controllers\CategoryController::class, 'search']);
Route::get('/category/checkDuplicate/{name}', [App\Http\Controllers\CategoryController::class, 'checkDuplicate']);
Route::get('/category/checkUniqueEdit/{id}/{name}', [App\Http\Controllers\CategoryController::class, 'checkUniqueEdit']);

Route::prefix('categories')->group(function () {
    Route::get('/', 'CategoryController@getCatgories');
});

//profile

Route::put('/profile/{id}/update_info', 'ProfileController@updateUserInfo');
Route::post('/profile/{id}/update_password', 'ProfileController@updatePassword');
Route::post('/profile/{id}/update_avatar', 'ProfileController@updateAvatar');
Route::resource('/profile', ProfileController::class);
Route::get('/avatar/{id}', [App\Http\Controllers\ProfileController::class, 'avatar']);

Route::get('/check-unique-edit/{id}/{name}', [App\Http\Controllers\TemplateMilestoneController::class, 'checkUniqueEdit']);
Route::get('/check-unique-add/{name}', [App\Http\Controllers\TemplateMilestoneController::class, 'checkUniqueAdd']);
Route::resource('/jf-list', JFListController::class);
Route::get('/jf-list', 'JFListController@index');
Route::get('/jf-list/delete/{id}', 'JFListController@destroy');

Route::post('/invite-member', [InviteMemberController::class, 'handleRequest']);

//Notification

Route::resource('/notification', NotificationController::class);
Route::get('/show-unread/{id}', [App\Http\Controllers\NotificationController::class, 'showUnread']);
Route::get('/show-notification-user/{id}/{user_id}', [App\Http\Controllers\NotificationController::class, 'showNotificationUser']);
Route::get('/show-user-uread/{id}/{user_id}', [App\Http\Controllers\NotificationController::class, 'showNotificationUserUread']);
