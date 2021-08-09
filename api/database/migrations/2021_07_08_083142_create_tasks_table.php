<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_time')->nullable();
            $table->date('end_time')->nullable();
            $table->unsignedInteger('number_of_member')->nullable();
            $table->string('status')->nullable();
            $table->boolean('remind_member')->nullable();
            $table->text('description_of_detail');
            $table->unsignedInteger('relation_task_id');
            $table->unsignedBigInteger('milestone_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
            $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
