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
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign('tasks_relation_task_id_foreign');
            $table->dropColumn('relation_task_id');
            $table->boolean('is_day');
            $table->string('unit');
            $table->decimal('effort', 5, 1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['is_day', 'unit', 'effort']);
            $table->unsignedBigInteger('relation_task_id');
        });
    }
}
