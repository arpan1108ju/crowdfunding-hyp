"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EnrollRevokeSkeleton } from "@/components/enroll-revoke-Skeleton"

export function SuperAdminSkeleton() {
  return (
    <div className="container mx-auto py-6">
      {/* Title Skeleton */}
      <Skeleton className="h-9 w-[300px] mb-6" />

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Admins Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-1" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>

        {/* Role Changes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-1" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-6">
        <div className="border-b">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[140px]" />
          </div>
        </div>
        
        {/* Tab Content Skeleton */}
        <div className="mt-4">
          <EnrollRevokeSkeleton />
        </div>
      </div>
    </div>
  )
} 