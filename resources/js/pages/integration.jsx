import { useState } from "react";
import { usePage } from '@inertiajs/react';

export default function Integration() {
    const {user,ledger} = usePage().props
    const [balance, setBalance] = useState(parseInt(user.balance)); // starting balance
    const [amount, setAmount] = useState(0);
    const [transactions, setTransactions] = useState([...ledger]);

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!amount) return;

        const newAmount = parseFloat(amount);

        try {
            // send request to Laravel API
            const response = await fetch("/ledger", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    user_id: 1, // replace with actual logged-in user id
                    type: "Deposit",
                    amount: newAmount,
                    status: "Completed",
                    date: new Date().toISOString().split("T")[0],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save deposit");
            }

            console.log("done");
            return;


            const savedTransaction = await response.json();

            // update UI state
            setBalance(balance + newAmount);

            setTransactions([
                savedTransaction, // use server response
                ...transactions,
            ]);

            setAmount("");
        } catch (error) {
            console.error("Deposit error:", error);
            alert("Could not process deposit. Please try again.");
        }
    };


    const handleWithdraw = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) > balance) return;

        const newAmount = parseFloat(amount);
        setBalance(balance - newAmount);

        setTransactions([
            {
                id: transactions.length + 1,
                type: "Withdrawal",
                amount: newAmount,
                status: "Completed",
                date: new Date().toISOString().split("T")[0],
            },
            ...transactions,
        ]);

        setAmount("");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-4xl space-y-6">
                {/* Balance */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold">Balance</h2>
                    <p className="text-2xl font-semibold mt-2">KES {balance}</p>
                </div>

                {/* Deposit & Withdraw */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Manage Funds</h2>
                    <form className="flex gap-3">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                            required
                        />
                        <button
                            onClick={handleDeposit}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Deposit
                        </button>
                        <button
                            onClick={handleWithdraw}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Withdraw
                        </button>
                    </form>
                </div>

                {/* Transactions Table */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
                    <h2 className="text-lg font-bold mb-4">Transactions</h2>
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2">Amount</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-3 py-2">{tx.id}</td>
                                <td className="px-3 py-2">{tx.type}</td>
                                <td className="px-3 py-2">KES {tx.amount}</td>
                                <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                                tx.status === "Completed"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                            }`}
                                        >
                                            {tx.status}
                                        </span>
                                </td>
                                <td className="px-3 py-2">{tx.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
