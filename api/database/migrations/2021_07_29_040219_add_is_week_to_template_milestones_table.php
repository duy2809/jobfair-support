<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIsWeekToTemplateMilestonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('template_milestones', function (Blueprint $table) {
            $table->boolean('is_week');
            $table->renameColumn('milestone_name', 'name');
            $table->unsignedInteger('period')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('template_milestones', function (Blueprint $table) {
            $table->renameColumn('name', 'milestone_name');
            $table->dropColumn('is_week');
            $table->dropColumn('period');
        });
    }
}