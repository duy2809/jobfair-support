<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditTableMilestones extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('milestones', function (Blueprint $table) {
            $table->unsignedInteger('period')->change();
            $table->dropForeign(['job_fair_id']);
            $table->dropColumn('job_fair_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('milestones', function (Blueprint $table) {
            $table->date('period')->change();
            $table->unsignedBigInteger('job_fair_id');
            $table->foreign('job_fair_id')->references('id')->on('jobfairs')->onDelete('cascade');
        });
    }
}
