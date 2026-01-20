@component('mail::message')
# Password Reset Request

You have requested to reset your password for your Tips Moto account.

Click the button below to reset your password:

@component('mail::button', ['url' => $actionUrl, 'color' => 'primary'])
{{ $actionText }}
@endcomponent

**This link will expire in 60 minutes.**

If you did not request a password reset, please disregard this email.

Thanks,<br>
{{ config('app.name') }}

@slot('footer')
@component('mail::footer')
If you're having trouble clicking the "{{ $actionText }}" button, copy and paste the URL below into your web browser:

[{{ $actionUrl }}]({{ $actionUrl }})
@endcomponent
@endslot
@endcomponent
