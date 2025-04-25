// Render a paginated list of members with navigation controls
import React from "react"
import MemberCard from "@/components/memberCard/MemberCard"
import { UserWithRelations } from "@/lib/stores/authStore"

interface MembersListWithPaginationProps {
  members: UserWithRelations[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  className?: string
}

export default function MembersListWithPagination({
  members,
  isLoading,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  className = ""
}: MembersListWithPaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  return (
    <div className={`flex flex-col gap-y-2 lg:gap-y-3 ${className}`}>
      <div className="grid gap-2 md:gap-3 xl:gap-4 md:grid-cols-2">
        {members.map((user) => (
          <MemberCard key={user.id} user={user} isLoading={isLoading} isLink />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="mx-2">Page {currentPage} / {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
