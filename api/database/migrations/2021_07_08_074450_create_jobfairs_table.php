<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobfairsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobfairs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_date');
            $table->unsignedInteger('number_of_students');
            $table->unsignedInteger('number_of_companies');
            $table->unsignedBigInteger('jobfair_admin_id');
            $table->unsignedBigInteger('schedule_id');
           
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobfairs');
    }
}
