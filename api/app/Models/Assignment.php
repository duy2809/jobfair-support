<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
protected $fillable = ['notification', 'join_date', 'completed_date', 'user_id', 'task_id'];
class Assignment extends Model
{
    use HasFactory;
}
