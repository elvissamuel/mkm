"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QUERY_KEY } from "@/lib/rbac";
import { getUsers, getUserById } from "@/lib/api-calls";
import { Search } from "lucide-react";
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TABS = [
  { label: "All Users", value: "ALL" },
  { label: "Unpaid Users", value: "USER" },
  { label: "Paid Users", value: "PREMIUM" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("ALL");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const limit = 10;

  const { data: usersData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GET_ALL_USERS, tab, page, limit, search],
    queryFn: () => getUsers(
      page,
      limit,
      tab === "ALL" ? undefined : tab as "USER" | "PREMIUM" | undefined,
      search
    ),
  });

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.pagination?.totalPages || 0;

  // User details modal
  const { data: userDetails, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", selectedUserId],
    queryFn: () => (selectedUserId ? getUserById(selectedUserId) : Promise.resolve({ data: undefined })),
    enabled: !!selectedUserId && showUserModal,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-t-md font-semibold border-b-2 transition-colors duration-150 ${
                tab === t.value
                  ? "border-[#c19b37] text-[#c19b37] bg-[#0e1723]"
                  : "border-transparent text-gray-400 bg-transparent hover:text-[#c19b37]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-[#0e1723] border-[#c19b37]/20 text-gray-200"
          />
        </div>
      </div>

      <div className="rounded-md border border-[#c19b37]/20">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Gender</TableHead>
              <TableHead className="text-gray-300">Country</TableHead>
              <TableHead className="text-gray-300">Joined Date</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-[#c19b37]/20"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user: User) => (
                <TableRow key={user.id} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  <TableCell className="font-medium text-gray-300">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300">{user.phone_number}</TableCell>
                  <TableCell className="text-gray-300">{user.gender || "-"}</TableCell>
                  <TableCell className="text-gray-300">{user.country || "-"}</TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-[#c19b37] hover:bg-[#a8842e] text-white"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setShowUserModal(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
                <TableCell colSpan={6} className="text-center text-gray-300">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md bg-[#c19b37] text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md bg-[#c19b37] text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* User Details Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-xl bg-white text-black rounded-xl shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">User Details</DialogTitle>
          </DialogHeader>
          {isUserLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : userDetails?.data ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b pb-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-[#c19b37] mb-1">
                    {userDetails.data.first_name} {userDetails.data.last_name}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{userDetails.data.email}</div>
                  <div className="text-sm text-gray-600 mb-1">Phone: <span className="font-medium text-gray-800">{userDetails.data.phone_number || '-'}</span></div>
                  <div className="text-sm text-gray-600 mb-1">Gender: <span className="font-medium text-gray-800">{userDetails.data.gender || '-'}</span></div>
                  <div className="text-sm text-gray-600 mb-1">Country: <span className="font-medium text-gray-800">{userDetails.data.country || '-'}</span></div>
                  <div className="text-sm text-gray-600">Joined: <span className="font-medium text-gray-800">{new Date(userDetails.data.created_at).toLocaleDateString()}</span></div>
                </div>
              </div>

              {/* Subscriptions */}
              <div>
                <div className="text-lg font-semibold mb-2 text-[#c19b37]">Subscriptions</div>
                {userDetails.data.user_subscriptions && userDetails.data.user_subscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {userDetails.data.user_subscriptions.map((sub: any) => (
                      <div key={sub.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div className="font-medium text-gray-800">Program: <span className="text-[#c19b37]">{sub.program?.name || '-'}</span></div>
                          <div className="text-sm text-gray-600">Status: <span className={`font-semibold ${sub.payment_status === 'fully_paid' ? 'text-green-600' : 'text-orange-600'}`}>{sub.payment_status.replace('_', ' ')}</span></div>
                        </div>
                        <div className="text-sm text-gray-700 mb-1">Payments:</div>
                        {sub.payments && sub.payments.length > 0 ? (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sub.payments.map((p: any) => (
                              <li key={p.id} className="bg-white rounded px-3 py-2 border border-gray-100 flex flex-col">
                                <span className="font-medium text-gray-800">Amount: <span className="text-[#c19b37]">${p.amount}</span></span>
                                <span className="text-xs text-gray-500">Date: {new Date(p.paid_at).toLocaleDateString()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-xs text-gray-500">No payments</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No subscriptions found.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">No user details found.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 