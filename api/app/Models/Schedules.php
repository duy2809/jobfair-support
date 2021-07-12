<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedules extends Model
{
    use HasFactory;

    public function templateMilestones()
    {
        return $this->hasMany(TemplateMilestone::class);
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    public function templateDocuments()
    {
        return $this->morphMany(TemplateDocument::class, 'templateDocumentable');
    }
}
