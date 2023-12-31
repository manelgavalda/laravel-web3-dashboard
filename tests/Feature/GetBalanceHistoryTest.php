<?php

use App\Models\User;
use App\Contracts\DatabaseService;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    bindFakeDatabaseService();

    $this->actingAs(User::factory()->create());
});

it('gets the balance history', function () {
    $this->get('api/get-balance-history')
         ->assertJsonCount(30)
         ->assertSeeTextInOrder([
            '2023-09-08', 'balance', 10, 'price', 1000,
            '2023-09-07', 'balance', 15, 'price', 2000,
            '2023-09-06', 'balance', 20, 'price', 3000,
         ]);
});

it('gets the token balances', function () {
    $this->get('api/get-token-balances')
         ->assertJsonCount(30)
         ->assertSeeTextInOrder([
            '2023-09-08', 'balance', 10, 'price', 1000,
            '2023-09-07', 'balance', 15, 'price', 2000,
            '2023-09-06', 'balance', 20, 'price', 3000,
         ]);
});

function bindFakeDatabaseService() {
    app()->bind(DatabaseService::class, fn() => new class('fakeApiKey', 'fakeUrl') implements DatabaseService {
        public function __construct($apiKey, $url) {
        }

        public function getHistoricalBalances() {
            return json_decode(File::get(
                base_path() . '/tests/Feature/responses/get_historical_balances.json'
            ));
        }
    });
}
