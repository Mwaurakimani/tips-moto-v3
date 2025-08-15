<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TipStoreRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'match_id' => 'required|exists:matches,id',
            'prediction_type' => 'required|string|max:40',
            'prediction_value' => 'required|integer|in:-1,0,1',
            'pick_label' => 'required|string|max:20',
            'odds' => 'nullable|numeric|min:1',
            'bookmaker' => 'nullable|string|max:80',
            'confidence' => 'nullable|integer|min:0|max:100',
            'risk_level' => 'nullable|in:low,mid,high',
            'is_free' => 'boolean',
            'free_for_date' => 'nullable|date',
            'visibility' => 'in:public,subscribers,purchased',
            'publish_at' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
