"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMyResults } from "@/src/services/students";

interface ApiResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    monthlyResults?: Record<string, unknown>[];
    weeklyMarks?: Record<string, unknown>[];
  };
}

export default function StudentResultsDashboard() {
  const [resultData, setResultData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getMyResults();

        console.log("API Response:", res);

        setResultData(res);
      } catch (err) {
        console.error(err);
        setError("Failed to load results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const monthlyResults = resultData?.data?.monthlyResults || [];
  const weeklyMarks = resultData?.data?.weeklyMarks || [];

  const monthlyColumns =
    monthlyResults?.length > 0
      ? Object.keys(monthlyResults?.[0] ?? {})
      : [];

  const weeklyColumns =
    weeklyMarks?.length > 0
      ? Object.keys(weeklyMarks?.[0] ?? {})
      : [];

  const renderCellValue = (value: unknown, column?: string) => {
    if (value === null || value === undefined) {
      return "-";
    }

    // Handle subject object
    if (
      column === "subject" &&
      typeof value === "object" &&
      value !== null
    ) {
      const subject = value as {
        subjectName?: string;
      };

      return subject?.subjectName ?? "-";
    }

    // Handle dates
    if (
      typeof value === "string" &&
      (column?.toLowerCase().includes("date") ||
        column === "createdAt" ||
        column === "updatedAt")
    ) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    // Handle any other nested object
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const noResultsPublished =
    !loading &&
    !error &&
    monthlyResults?.length === 0 &&
    weeklyMarks?.length === 0;

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex min-h-100 items-center justify-center">
          <p className="text-muted-foreground text-lg">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="border-destructive">
          <CardContent className="py-10 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (noResultsPublished) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-semibold">
              No Result Is Published Now
            </h2>
            <p className="text-muted-foreground mt-2">
              Please check back later for published results.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          Student Results Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          View your monthly results and weekly marks.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {monthlyResults?.length}
            </div>
            <Badge variant="secondary" className="mt-2">
              Monthly Records
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Weekly Marks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {weeklyMarks?.length}
            </div>
            <Badge variant="secondary" className="mt-2">
              Weekly Records
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Monthly Results */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Results</CardTitle>
        </CardHeader>

        <CardContent>
          {monthlyResults?.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                No monthly results found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {monthlyColumns?.map((column) => (
                      <TableHead key={column}>
                        {column.replace(/([A-Z])/g, " $1").trim()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {monthlyResults?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {monthlyColumns?.map((column) => (
                        <TableCell key={`${rowIndex}-${column}`}>
                          {renderCellValue(row?.[column], column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Marks */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Marks</CardTitle>
        </CardHeader>

        <CardContent>
          {weeklyMarks?.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                No weekly marks found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {weeklyColumns?.map((column) => (
                      <TableHead key={column}>
                        {column.replace(/([A-Z])/g, " $1").trim()}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {weeklyMarks?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {weeklyColumns?.map((column) => (
                        <TableCell key={`${rowIndex}-${column}`}>
                          {renderCellValue(row?.[column], column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}