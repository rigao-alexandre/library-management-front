import { BaseLayout } from "@/components/layout/base-layout";
import type { Route } from "./+types/dashboard";
import { ReporttService } from "@/lib/reporttService";
import { data, useLoaderData } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";

const chartConfig = {
  checkin: {
    label: "Check in",
    color: "hsl(var(--chart-1))",
  },
  checkout: {
    label: "Check out",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const eventMap = {
  ["CHECK IN"]: "checkin",
  ["CHECK OUT"]: "checkout",
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Dashboard" },
  ];
}

export const loader = async () => {
  const dashboard = await new ReporttService().index();

  return data({
    dashboard,
  });
};

export default function Home() {
  const { dashboard } = useLoaderData<typeof loader>();

  const groupedByDate = new Map<
    string,
    {
      date: string;
      checkin?: number | null | undefined;
      checkout?: number | null | undefined;
    }
  >();

  for (const item of dashboard.history) {
    groupedByDate.set(item.date, {
      ...(groupedByDate.get(item.date) ?? { date: item.date }),
      [eventMap[item.event]]: item.total ?? 0,
    });
  }

  const chartData = Array.from(groupedByDate.values()).map((item) => ({
    ...item,
    checkin: item.checkin ?? 0,
    checkout: item.checkout ?? 0,
  }));

  return (
    <BaseLayout>
      <div className="grid gap-4 grid-cols-1 my-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books</CardTitle>
          </CardHeader>
          <CardContent>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <CardDescription>
                  <Button variant="link" asChild>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/report/books`}
                      target="_new"
                    >
                      Download books list
                    </a>
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboard.books.totalByDeadline.total}
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 grid-cols-2 my-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Checked in
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboard.books.totalByStatus.find(
                      (item) => item.status === "CHECKED IN"
                    )?.total ?? 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Checked out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboard.books.totalByStatus.find(
                      (item) => item.status === "CHECKED OUT"
                    )?.total ?? 0}
                  </div>
                </CardContent>
                <div className="grid gap-4 grid-cols-3 my-2">
                  <Card className="border border-red-400 text-red-700 ">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Delayed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <div className="text-2xl font-bold">
                        {dashboard.books.totalByDeadline.totalDelayed}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-orange-400 text-orange-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Today
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboard.books.totalByDeadline.totalToday}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-green-400 text-green-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        On time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {dashboard.books.totalByDeadline.totalOnTime}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Card>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3 my-2"></div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 my-2">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Top books</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {dashboard.books.rankings.monthly.map((item) => (
                <div key={item.book.id} className="flex items-center gap-4">
                  <div className="flex flex-1 flex-wrap items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {item.book.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {item.book.author}
                      </p>
                    </div>
                    <div className="font-medium">{item.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Top members</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {dashboard.members.rankings.weekly.map((item) => (
                <div key={item.member.id} className="flex items-center gap-4">
                  <div className="flex flex-1 flex-wrap items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {item.member.fullName}
                      </p>
                    </div>
                    <div className="font-medium">{item.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 my-2">
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig}>
              {/* <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={3}
                  type="number"
                  domain={[0, 25]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="checkin"
                  type="linear"
                  fill="var(--color-checkin)"
                  fillOpacity={0.4}
                  stroke="var(--color-checkin)"
                  stackId="a"
                />
                <Area
                  dataKey="checkout"
                  type="linear"
                  fill="var(--color-checkout)"
                  fillOpacity={0.4}
                  stroke="var(--color-checkout)"
                  stackId="a"
                />
              </AreaChart> */}

              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={3}
                  type="number"
                  domain={[0, 10]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="checkin" fill="var(--color-checkin)" radius={4} />
                <Bar
                  dataKey="checkout"
                  fill="var(--color-checkout)"
                  radius={4}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
