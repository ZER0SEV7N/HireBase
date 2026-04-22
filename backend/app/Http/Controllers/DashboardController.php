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
            $metrics = DB::select('CALL sp_dashboard()');

            $data = !empty($metrics) ? $metrics[0] : null;

            return response()->json([
                'success' => true,
                'data' => $data,
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
