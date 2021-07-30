<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function templateMilestones()
    {
        return $this->hasMany(TemplateMilestone::class);
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function tasks()
    {
        return $this->hasManyThrough(Task::class, Milestone::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'list_members');
    }

    public function templateDocuments()
    {
        return $this->morphMany(TemplateDocument::class, 'templateDocumentable');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function jobfair()
    {
        return $this->belongsTo(Jobfair::class);
    }
}
