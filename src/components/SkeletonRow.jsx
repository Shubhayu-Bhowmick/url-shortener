import { TableRow, TableCell } from "./ui/table"
import { Skeleton } from "./ui/skeleton"

const SkeletonRow = () => {
  return (
    <TableRow className="hover:bg-white hover:bg-opacity-5 transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-4 w-12 mx-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8" />
      </TableCell>
    </TableRow>
  )
}

export default SkeletonRow
