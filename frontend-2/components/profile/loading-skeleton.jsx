import { Skeleton } from "@/components/ui/skeleton"

export function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        {/* Profile Picture Skeleton */}
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
    </div>
  )
} 