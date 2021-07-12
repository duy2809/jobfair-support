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

    public function categoryDetail()
    {
        return $this->morphOne(CategoryDetail::class, 'categoryDetailable');
    }
}
