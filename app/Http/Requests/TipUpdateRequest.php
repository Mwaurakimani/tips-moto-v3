<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TipUpdateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'prediction_type' => 'sometimes|string|max:40',
            'prediction_value' => 'sometimes|integer|in:-1,0,1',
            'pick_label' => 'sometimes|string|max:20',
            'odds' => 'nullable|numeric|min:1',
            'bookmaker' => 'nullable|string|max:80',
            'confidence' => 'nullable|integer|min:0|max:100',
            'risk_level' => 'nullable|in:low,mid,high',
            'is_free' => 'boolean',
            'free_for_date' => 'nullable|date',
            'visibility' => 'in:public,subscribers,purchased',
            'publish_at' => 'nullable|date',
            'status' => 'nullable|in:pending,settled',
            'result' => 'nullable|in:pending,won,lost,void,canceled',
            'settled_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
