<?php

namespace App\Http\Requests;

use App\Models\TemplateTask;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class TemplateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        Validator::extend('validate_milestone', function ($attr, $value) {
            $milestone = TemplateTask::find($value[0])->milestone_id;
            foreach ($value as $item) {
                $id = TemplateTask::find($item)->milestone_id;
                if ($milestone !== $id) {
                    return false;
                }
            }

            return true;
        });
        switch ($this->method()) {
            case 'POST':
                return [
                    'name' => 'string|required|unique:template_tasks',
                    'children' => 'required|array|validate_milestone',
                ];

                break;
            case 'PATCH':
            case 'PUT':
                return [
                    'name' => 'string|required|unique:template_tasks,name,'.$this->template_task,
                    'children' => 'array|validate_milestone',
                ];

                break;
        }
    }

    public function messages()
    {
        return [
            'name.unique' => 'ユーザーが使用されているJF名を入力した',
            'children.validate_milestone' => 'invalid milestone',
        ];
    }
}
