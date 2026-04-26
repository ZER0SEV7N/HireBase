<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getMetrics()
    {
        try{

            $metrics = DB::table('users')
                ->selectRaw("
                    COUNT(*) AS total_users,
                    SUM(CASE WHEN status = 'Review' THEN 1 ELSE 0 END) AS Pending_Review,
                    SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) AS in_Interview,
                    SUM(CASE WHEN status = 'Hired' THEN 1 ELSE 0 END) AS Hired,
                    SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS Rejected
                ")
                ->where('role', 'user')
                ->first(); 

            $trend = DB::table('users')
                ->selectRaw("DATE(created_at) AS registration_date, COUNT(*) AS registration_count")
                ->where('role', 'user')
                ->groupBy('registration_date')
                ->orderBy('registration_date', 'ASC')
                ->limit(7)
                ->get(); 

            return response()->json([
                'success' => true,
                'data' => [
                    'metrics' => $metrics,
                    'trend' => $trend
                ],
                'message' => 'Dashboard metrics retrieved successfully'
            ], 200);

        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard metrics: ' . $e->getMessage()
            ], 500);
        }
    }
}
