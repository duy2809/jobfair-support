<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateTask extends Model
{
    use HasFactory;

    public function templateMilestone()
    {
        return $this->belongsTo(TemplateMilestone::class);
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
