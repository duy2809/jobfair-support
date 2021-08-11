<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
<<<<<<< HEAD
    protected $fillable = ['category_name'];

=======
    
    protected $fillable = ['category_name'];
>>>>>>> 0f21d90c88a79a75041b61158f6284e73a35a612
    public function tasks()
    {
        return $this->morphedByMany(Task::class, 'categoriable');
    }

    public function templateTasks()
    {
        return $this->morphedByMany(TemplateTask::class, 'categoriable');
    }

    public function users()
    {
        return $this->morphedByMany(User::class, 'categoriable');
    }

    public function categoryDetails()
    {
        return $this->hasMany(CategoryDetail::class);
    }
}
