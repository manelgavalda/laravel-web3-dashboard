<?php

namespace App\Contracts;

interface DatabaseService
{
    public function __construct($apiKey, $url);

    public function getHistoricalBalances();

    public function getTokens();
}
