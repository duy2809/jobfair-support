<?php

/*
|--------------------------------------------------------------------------
| ADMIN Routes
|--------------------------------------------------------------------------
|
| Here is where you can register ADMIN routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "admin" middleware group. Enjoy building your API!
|
 */
use App\Http\Controllers\InviteMemberController;
use Illuminate\Support\Facades\Route;

Route::resource('/jobfair', JobfairController::class)->only([
    'store',
    'update',
    'destroy',
]);
Route::post('/invite-member', [InviteMemberController::class, 'handleRequest']);
Route::resource('/template-tasks', 'TemplateTaskController')->only([
    'store',
    'update',
    'destroy',
]);
Route::resource('/schedules', 'ScheduleController')->only([
    'store',
    'update',
    'destroy',
]);
Route::resource('/milestone', MilestoneController::class);
Route::apiResource('/category', CategoryController::class);
