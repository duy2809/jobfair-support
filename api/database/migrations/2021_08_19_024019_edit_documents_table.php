<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->string('name');
            $table->string('link');
            $table->unsignedBigInteger('preFolderId')->nullable();
            $table->boolean('is_file');
            $table->dropColumn('description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('link');
            $table->dropColumn('preFolderId');
            $table->dropColumn('is_file');
            $table->text('description');
        });
    }
}
