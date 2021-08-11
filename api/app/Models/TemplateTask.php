<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateTask extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $guarded = [];

    public function milestone()
    {
        return $this->belongsTo(Milestone::class, 'milestone_id');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'commentable');
    }

    public function categories()
    {
        return $this->morphToMany(Category::class, 'categoriable');
    }

    public function afterTasks()
    {
        return $this->belongsToMany(self::class, 'pivot_table_template_tasks', 'before_tasks', 'after_tasks');
    }

    public function beforeTasks()
    {
        return $this->belongsToMany(self::class, 'pivot_table_template_tasks', 'after_tasks', 'before_tasks');
    }

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class);
    }
}
