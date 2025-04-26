"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { EnrollRevokeSkeleton } from "@/components/enroll-revoke-Skeleton"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AdminSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[120px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b">
        <div className="flex gap-4 py-2">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-8 w-[120px]" />
        </div>
      </div>

      <div className="mt-4">
          <EnrollRevokeSkeleton />
      </div>

      {/* Table Skeleton */}
      
    </div>
  )
}
