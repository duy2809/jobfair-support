<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['name', 'period', 'schedule_id', 'is_week'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}
