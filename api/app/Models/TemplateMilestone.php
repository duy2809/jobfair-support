<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateMilestone extends Model
{
    use HasFactory;

    public function templateTasks()
    {
        return $this->hasMany(TemplateTask::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
