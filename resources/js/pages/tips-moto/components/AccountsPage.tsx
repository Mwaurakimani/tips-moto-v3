import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from './ui/badge';
import { UserDetailView } from '@/pages/AdminDashboardSystem/Accounts/UserDetailView';

// Generate 435 users with realistic data
const generateUsers = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Emily",
    "Robert",
    "Jessica",
    "William",
    "Ashley",
    "James",
    "Amanda",
    "Christopher",
    "Melissa",
    "Daniel",
    "Deborah",
    "Matthew",
    "Dorothy",
    "Anthony",
    "Lisa",
    "Mark",
    "Nancy",
    "Donald",
    "Karen",
    "Steven",
    "Betty",
    "Paul",
    "Helen",
    "Andrew",
    "Sandra",
    "Joshua",
    "Donna",
    "Kenneth",
    "Carol",
    "Kevin",
    "Ruth",
    "Brian",
    "Sharon",
    "George",
    "Michelle",
    "Timothy",
    "Laura",
    "Ronald",
    "Sarah",
    "Jason",
    "Kimberly",
    "Edward",
    "Deborah",
    "Jeffrey",
    "Dorothy",
    "Ryan",
    "Lisa",
    "Jacob",
    "Nancy",
    "Gary",
    "Karen",
    "Nicholas",
    "Betty",
    "Eric",
    "Helen",
    "Jonathan",
    "Sandra",
    "Stephen",
    "Donna",
    "Larry",
    "Carol",
    "Justin",
    "Ruth",
    "Scott",
    "Sharon",
    "Brandon",
    "Michelle",
    "Benjamin",
    "Laura",
    "Samuel",
    "Emily",
    "Gregory",
    "Kimberly",
    "Alexander",
    "Deborah",
    "Patrick",
    "Dorothy",
    "Frank",
    "Amy",
    "Raymond",
    "Angela",
    "Jack",
    "Ashley",
    "Dennis",
    "Brenda",
    "Jerry",
    "Emma",
    "Tyler",
    "Olivia",
    "Aaron",
    "Cynthia",
    "Jose",
    "Marie",
    "Henry",
    "Janet",
    "Douglas",
    "Catherine",
    "Adam",
    "Frances",
    "Nathan",
    "Christine",
    "Peter",
    "Samantha",
    "Zachary",
    "Debra",
    "Kyle",
    "Rachel",
    "Noah",
    "Carolyn",
    "William",
    "Janet",
    "Jordan",
    "Virginia",
    "Andrew",
    "Maria",
    "Max",
    "Heather",
    "Evan",
    "Diane",
    "Robert",
    "Julie",
    "Connor",
    "Joyce",
    "Owen",
    "Victoria",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Gomez",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Reyes",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Gutierrez",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
  ];

  const roleWeights = [0.7, 0.25, 0.05]; // 70% Guest, 25% Premium, 5% Admin

  const users = [];
  const baseDate = new Date("2024-01-01");
  const endDate = new Date("2025-01-30");

  for (let i = 1; i <= 435; i++) {
    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 100 ? i : ""}@${["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com"][Math.floor(Math.random() * 5)]}`;

    // Generate phone number in Kenyan format
    const phoneNumber = `07${Math.floor(
      Math.random() * 100000000,
    )
      .toString()
      .padStart(8, "0")}`;

    // Weighted random role selection
    const rand = Math.random();
    let role = "Guest";
    if (rand < roleWeights[2]) role = "Admin";
    else if (rand < roleWeights[2] + roleWeights[1])
      role = "Premium";

    // Random date between baseDate and endDate
    const randomTime =
      baseDate.getTime() +
      Math.random() * (endDate.getTime() - baseDate.getTime());
    const randomDate = new Date(randomTime);
    const dateJoined = randomDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    users.push({
      id: i,
      user: `${firstName} ${lastName}`,
      email,
      phone: phoneNumber,
      role,
      dateJoined,
      dateObject: randomDate, // For sorting
    });
  }

  // Sort by most recent registration (newest first)
  return users.sort(
    (a, b) => b.dateObject.getTime() - a.dateObject.getTime(),
  );
};

const USERS_PER_PAGE = 10;

export function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const allUsers = useMemo(() => generateUsers(), []);

  const filteredAccounts = useMemo(() => {
    return allUsers.filter((account) => {
      const matchesSearch =
        account.user
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        account.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        account.phone.includes(searchTerm);
      const matchesRole =
        selectedRole === "All" || account.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [allUsers, searchTerm, selectedRole]);

  const totalPages = Math.ceil(
    filteredAccounts.length / USERS_PER_PAGE,
  );
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  const handleFilterChange = (newRole: string) => {
    setSelectedRole(newRole);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewUser = (userId: number) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleBackToAccounts = () => {
    setSelectedUser(null);
  };

  const handleExport = () => {
    // CSV Headers
    const headers = ['ID', 'User', 'Email', 'Phone', 'Role', 'Date Joined'];

    // Convert filtered accounts to CSV format
    const csvContent = [
      headers.join(','),
      ...filteredAccounts.map(account => [
        account.id,
        `"${account.user}"`, // Wrap in quotes to handle commas in names
        account.email,
        account.phone,
        account.role,
        account.dateJoined
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tips-moto-accounts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-orange-500 text-white";
      case "Premium":
        return "bg-blue-500 text-white";
      case "Guest":
      default:
        return "bg-gray-500 text-white";
    }
  };

  const totalUsers = allUsers.length;
  const guestUsers = allUsers.filter(
    (account) => account.role === "Guest",
  ).length;
  const premiumUsers = allUsers.filter(
    (account) => account.role === "Premium",
  ).length;
  const adminUsers = allUsers.filter(
    (account) => account.role === "Admin",
  ).length;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++)
          pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // If a user is selected, show the user detail view
  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        onBack={handleBackToAccounts}
        onUserUpdate={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header with Search */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Accounts Table */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  All Accounts ({filteredAccounts.length} of{" "}
                  {totalUsers})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      {selectedRole === "All"
                        ? "All Roles"
                        : selectedRole}
                    </Button>
                    {filterOpen && (
                      <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                        <div className="p-1">
                          {[
                            "All",
                            "Guest",
                            "Premium",
                            "Admin",
                          ].map((role) => (
                            <button
                              key={role}
                              onClick={() =>
                                handleFilterChange(role)
                              }
                              className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                selectedRole === role
                                  ? "bg-orange-500 text-white"
                                  : ""
                              }`}
                            >
                              {role === "All"
                                ? "All Roles"
                                : role}{" "}
                              {role !== "All" &&
                                `(${
                                  role === "Guest"
                                    ? guestUsers
                                    : role === "Premium"
                                      ? premiumUsers
                                      : adminUsers
                                })`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b">
                    <TableHead className="px-4 py-3 min-w-[80px]">
                      ID
                    </TableHead>
                    <TableHead className="px-4 py-3 min-w-[250px]">
                      User
                    </TableHead>
                    <TableHead className="px-4 py-3 min-w-[140px]">
                      Phone
                    </TableHead>
                    <TableHead className="px-4 py-3 min-w-[100px]">
                      Role
                    </TableHead>
                    <TableHead className="px-4 py-3 min-w-[120px]">
                      Date Joined
                    </TableHead>
                    <TableHead className="px-4 py-3 min-w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAccounts.map((account, index) => (
                    <TableRow
                      key={account.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b last:border-b-0"
                    >
                      <TableCell className="font-medium px-4 py-3 text-gray-600">
                        #{account.id}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {account.user}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {account.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-sm">
                        {account.phone}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`${getRoleBadgeColor(account.role)} text-xs px-2 py-1`}
                        >
                          {account.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {account.dateJoined}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewUser(account.id)
                          }
                          className="h-8 px-3 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + USERS_PER_PAGE,
                      filteredAccounts.length,
                    )}{" "}
                    of {filteredAccounts.length} results
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(
                          Math.max(1, currentPage - 1),
                        )
                      }
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {generatePageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={index}
                          className="px-2 text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <Button
                          key={index}
                          variant={
                            currentPage === page
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setCurrentPage(page as number)
                          }
                          className={`h-8 w-8 p-0 ${currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                        >
                          {page}
                        </Button>
                      ),
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage(
                          Math.min(totalPages, currentPage + 1),
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {filteredAccounts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-lg font-medium mb-2">
                    No accounts found
                  </div>
                  <div className="text-sm">
                    Try adjusting your search or filter criteria
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <div className="xl:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total users
                  </span>
                  <span className="font-semibold text-lg">
                    {totalUsers}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Guest users
                  </span>
                  <span className="font-semibold">
                    {guestUsers}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Premium users
                  </span>
                  <span className="font-semibold">
                    {premiumUsers}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Admin users
                  </span>
                  <span className="font-semibold">
                    {adminUsers}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">
                  Role Distribution
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Guest
                      </span>
                      <span className="font-medium">
                        {Math.round(
                          (guestUsers / totalUsers) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(guestUsers / totalUsers) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Premium
                      </span>
                      <span className="font-medium">
                        {Math.round(
                          (premiumUsers / totalUsers) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(premiumUsers / totalUsers) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Admin
                      </span>
                      <span className="font-medium">
                        {Math.round(
                          (adminUsers / totalUsers) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(adminUsers / totalUsers) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}
