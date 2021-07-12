<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemplateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('template_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('relation_task_id');
            $table->date('start_time');
            $table->date('end_time');
            $table->unsignedInteger('number_of_member');
            $table->date('time');
            $table->unsignedSmallInteger('status');
            $table->boolean('remind_remember');
            $table->text('description_of_detail');
            $table->unsignedBigInteger('milestone_id');
            $table->foreign('milestone_id')->references('id')->on('template_milestones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('template_tasks');
    }
}
