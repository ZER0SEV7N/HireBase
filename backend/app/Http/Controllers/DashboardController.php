<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DashboardController extends Controller
{
    public function getMetrics()
    {
        try{
            $metricsRaw = DB::select('CALL sp_dashboard()');
            $metrics = !empty($metricsRaw) ? $metricsRaw[0] : null;

            $trend = DB::select('CALL sp_recentUsers()');

            return response()->json([
                'success' => true,
                'data' => [
                    'metrics' => $metrics,
                    'trend' => $trend
                ],
                'message' => 'Dashboard metrics retrieved successfully'
            ],200);

        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard metrics: ' . $e->getMessage()
            ], 500);
        }
    }
}
