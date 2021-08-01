<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateMilestone extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $guarded = [];

    public function templateTasks()
    {
        return $this->hasMany(TemplateTask::class);
    }
}
