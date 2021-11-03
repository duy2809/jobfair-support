<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleRequest extends FormRequest
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
        // $id = $this->route('schedules')->id; // lấy id bài post muốn update
        return [
            'addedMilestones' => 'required|array',
            'addedTemplateTasks' => 'required|array',
        ];
    }

    public function messages()
    {
        return [
            'addedMilestones.required' => 'マイルストーンを入力してください。',
            'addedTemplateTasks.required' => 'テンプレートタスクを入力してください。',
        ];
    }
}
