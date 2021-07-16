<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function tasks()
    {
        return $this->morphedByMany(Task::class, 'categoriable');
    }

    public function templateTasks()
    {
        return $this->morphedByMany(TemplateTask::class, 'categoriable');
    }
}
