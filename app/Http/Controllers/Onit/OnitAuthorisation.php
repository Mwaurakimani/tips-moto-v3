<?php

namespace App\Http\Controllers\Onit;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Exception;

class OnitAuthorisation
{
    protected $client;
    protected $token;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.onitmfbank.com/api/v1/',
        ]);
    }

    /**
     * Authenticate and get JWT token
     */
    public function authenticate()
    {
        try {
            $headers = [
                'Content-Type' => 'application/json',
            ];

            $body = json_encode([
                'userId'     => env('ONIT_CLIENT_ID'),
                'password' => env('ONIT_CLIENT_SECRET'),
            ]);

            $request = new Request('POST', 'auth/jwt', $headers, $body);
            $res = $this->client->send($request);

            $data = json_decode($res->getBody()->getContents(), true);

            $this->token = $data['access_token'] ?? null;

            return $data;
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Make a deposit
     */
    public function deposit(array $payload)
    {
        try {
            if (!$this->token) {
                // authenticate first if no token
                $this->authenticate();
            }

            $headers = [
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . $this->token,
            ];

            $body = json_encode($payload);

            $request = new Request('POST', 'transaction/deposit', $headers, $body);
            $res = $this->client->send($request);

            return json_decode($res->getBody()->getContents(), true);
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}


