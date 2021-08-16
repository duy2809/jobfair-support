<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateTask extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description_of_detail', 'milestone_id', 'is_day', 'unit', 'effort'];public $timestamps = false;
    protected $guarded = [];

    public function templateMilestone()
    {
        return $this->belongsTo(TemplateMilestone::class, 'milestone_id');
    }

    public function templateDocuments()
    {
        return $this->morphMany(TemplateDocuments::class, 'templateDocumentable');
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
}
