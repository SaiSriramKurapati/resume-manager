// src/app/components/TableSkeleton.tsx
export default function TableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full backdrop-blur-sm border border-gray-200/50 shadow-sm rounded">
                <thead>
                    <tr className="text-left">
                        <th className="py-2 px-4 border-b border-gray-200/50">
                            <div className="h-4 w-4 bg-gray-200/50 rounded animate-pulse" />
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200/50">
                            <div className="h-4 w-24 bg-gray-200/50 rounded animate-pulse" />
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200/50">
                            <div className="h-4 w-20 bg-gray-200/50 rounded animate-pulse" />
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200/50">
                            <div className="h-4 w-32 bg-gray-200/50 rounded animate-pulse" />
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200/50">
                            <div className="h-4 w-24 bg-gray-200/50 rounded animate-pulse" />
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200/50">
                            <div className="h-4 w-24 bg-gray-200/50 rounded animate-pulse" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(5)].map((_, index) => (
                        <tr key={index} className="border-b border-gray-200/50">
                            <td className="py-2 px-4">
                                <div className="h-4 w-4 bg-gray-200/50 rounded animate-pulse" />
                            </td>
                            <td className="py-2 px-4">
                                <div className="h-4 w-48 bg-gray-200/50 rounded animate-pulse" />
                            </td>
                            <td className="py-2 px-4">
                                <div className="h-4 w-32 bg-gray-200/50 rounded animate-pulse" />
                            </td>
                            <td className="py-2 px-4">
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-gray-200/50 rounded animate-pulse" />
                                    <div className="h-6 w-20 bg-gray-200/50 rounded animate-pulse" />
                                </div>
                            </td>
                            <td className="py-2 px-4">
                                <div className="h-4 w-32 bg-gray-200/50 rounded animate-pulse" />
                            </td>
                            <td className="py-2 px-4">
                                <div className="flex gap-2">
                                    <div className="h-5 w-5 bg-gray-200/50 rounded animate-pulse" />
                                    <div className="h-5 w-5 bg-gray-200/50 rounded animate-pulse" />
                                    <div className="h-5 w-5 bg-gray-200/50 rounded animate-pulse" />
                                    <div className="h-5 w-5 bg-gray-200/50 rounded animate-pulse" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}