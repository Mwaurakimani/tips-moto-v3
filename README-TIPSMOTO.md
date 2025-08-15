# Tips Moto API Starter (SPA-ready)

This pack includes:
- Models, Migrations, Seeders
- Controllers using **Form Requests** + **API Resources**
- Policies registered in `AuthServiceProvider`
- Factories
- Feature tests
- Sanctum SPA cookie session routes for `/login`, `/register`, `/logout`
- API routes under `routes/api.php`
- CORS config allowing credentials

## Install

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
php artisan db:seed
```

Ensure your `.env` has:

```
SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:5173
SESSION_DOMAIN=localhost
APP_URL=http://localhost
```

Frontend (Vite/React/Inertia) should:
1. Hit `GET /sanctum/csrf-cookie` once.
2. Send `fetch`/axios with `credentials: 'include'`.
3. Use:
   - `POST /login` (JSON `{ email, password }`)
   - `GET /api/me` (current user)
   - `POST /logout`

## Key Endpoints

- `GET /api/leagues?` — leagues list
- `GET /api/teams?league_id=...` — teams in a league
- `GET /api/matches` / `GET /api/matches/{id}`
- `GET /api/tips?free_today=1`
- `POST /api/tips` (auth) — create
- `PUT /api/tips/{id}` (auth) — update
- `DELETE /api/tips/{id}` (auth) — delete
- `GET /api/plans`
- `GET /api/subscriptions` (auth)
- `POST /api/subscriptions` (auth)
- `POST /api/subscriptions/{id}/cancel` (auth)
- `GET /api/transactions` (auth)
- `POST /api/tip-purchases` (auth) — mock purchase & grant access
- `GET /api/notifications` (auth), `POST /api/notifications/{id}/read`
- `GET /api/support/tickets` (auth)
- `POST /api/support/tickets` (auth)
- `POST /api/support/tickets/{ticket}/message` (auth)

## Tests

```bash
php artisan test
```

## Notes
- For production, lock down `config/cors.php` to your real domain(s).
- Replace mock purchasing with your gateway integration and set `transactions.provider` fields accordingly.
