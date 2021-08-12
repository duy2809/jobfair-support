<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->dropForeign('assignments_task_id_foreign');
        });
        Schema::dropIfExists('tasks');
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_time');
            $table->date('duration');
            $table->string('status');
            $table->boolean('remind_member')->nullable();
            $table->text('description_of_detail')->nullable();
            $table->unsignedBigInteger('milestone_id');
            $table->unsignedBigInteger('schedule_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
            $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');
            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
        });
        Schema::table('assignments', function (Blueprint $table) {
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('assignments', function (Blueprint $table) {
            $table->dropForeign('assignments_task_id_foreign');
        });
        Schema::dropIfExists('tasks');
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_time');
            $table->date('end_time');
            $table->unsignedInteger('number_of_member');
            $table->string('status');
            $table->boolean('remind_member');
            $table->text('description_of_detail');
            $table->unsignedInteger('relation_task_id');
            $table->unsignedBigInteger('milestone_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
            $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');
        });
        Schema::table('assignments', function (Blueprint $table) {
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }
}
