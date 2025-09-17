import { Skeleton } from "@/components/ui/skeleton"

export default function DictionaryLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-40 ml-2" />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-full mb-4" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <Skeleton className="w-full aspect-[2/3] rounded-md mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
