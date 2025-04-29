import { BaseLayout } from "@/components/layout/base-layout";
import type { Route } from "./+types/dashboard";
import { ReporttService } from "@/lib/reporttService";
import { data, useLoaderData } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  ["CHECK IN"]: {
    label: "Check in",
    color: "hsl(var(--chart-1))",
  },
  ["CHECK OUT"]: {
    label: "Check out",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

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
      ["CHECK IN"]?: number | null | undefined;
      ["CHECK OUT"]?: number | null | undefined;
    }
  >();

  for (const item of dashboard.history) {
    groupedByDate.set(item.date, {
      ...(groupedByDate.get(item.date) ?? { date: item.date }),
      [item.event]: item.total,
    });
  }

  console.log(Array.from(groupedByDate.values()));

  return (
    <BaseLayout>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 my-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              To be checked in today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.books.totalByDeadline.totalToday}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.books.totalByDeadline.totalDelayed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.books.totalByDeadline.totalOnTime}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.books.totalByDeadline.total}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 my-2">
        {dashboard.books.totalByStatus.map((item) => (
          <Card key={item.status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.total}</div>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.members.total}</div>
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
              <AreaChart
                accessibilityLayer
                data={Array.from(groupedByDate.values())}
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
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="CHECK IN"
                  type="natural"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-1))"
                  stackId="a"
                />
                <Area
                  dataKey="CHECK OUT"
                  type="natural"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-2))"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
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
    </BaseLayout>
  );
}
