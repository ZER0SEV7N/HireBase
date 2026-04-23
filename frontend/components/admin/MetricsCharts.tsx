//Frontend/Hirebase/components/admin/MetricsCharts.tsx
//Componente para mostrar los graficos de metricas en el dashboard del admin
'use client';

import { DashboardMetricsHook } from '@/hooks/DashBoardHook';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Users, Clock, UserCheck, UserX, Loader2, Car } from 'lucide-react';

//Componente principal para mostrar los graficos de metricas
export default function MetricsCharts() {
    const { metrics, trend, isLoading } = DashboardMetricsHook();

    if(isLoading || !metrics) 
        return (<div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
        );
    
    //Preparar la data de graficos
    const pieData = [
        { status: "Hired", count: Number(metrics.Hired), fill: "var(--color-hired)" },
        { status: "Rejected", count: Number(metrics.Rejected), fill: "var(--color-rejected)" },
        { status: "In Process", count: Number(metrics.Pending_Review) + Number(metrics.In_Interview), fill: "var(--color-process)" },
    ];

    //Configurar los colores y etiquetas de los graficos
    const chartConfig = {
        count: { label: "Candidates" },
        hired: { label: "Hired", color: "#10b981" },      //Verde
        rejected: { label: "Rejected", color: "#ef4444" },//Rojo
        process: { label: "In Process", color: "#3b82f6" },//Azul
    } satisfies ChartConfig;

    //Configurar color del grafico de barras
    const barConfig = {
        count : { label: "Registrations", color: "#033991" },
    } satisfies ChartConfig;

    return (
        <div className="space-y-6">
            
            {/* Tarjetas de KPIs (UI en Inglés) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Candidates</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.total_users}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Under Review</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.Pending_Review}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Hired</CardTitle>
                        <UserCheck className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.Hired}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{metrics.Rejected}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <Card>
                    <CardHeader>
                        <CardTitle>Registration Trend</CardTitle>
                        <CardDescription>New candidates joined in the last days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={barConfig} className="min-h-[300px] w-full">
                            <BarChart accessibilityLayer data={trend} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tickLine={false} 
                                    tickMargin={10} 
                                    axisLine={false}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis tickLine={false} axisLine={false} tickMargin={10} allowDecimals={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={false} />} />
                                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pipeline Results</CardTitle>
                        <CardDescription>Success vs Rejection distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full max-w-[300px]">
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={pieData}
                                    dataKey="count"
                                    nameKey="status"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}