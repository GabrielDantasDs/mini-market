import React from "react";
import List from "./components/list";

export default function Products() {
	// Example data, replace with real data from your backend or context

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col items-center">
				<h1 className="text-3xl font-bold text-blue-700 mb-4">
					Products
				</h1>
				<div className="flex flex-col sm:flex-row gap-8 w-full justify-center mt-8">
                    <List />
				</div>
			</div>
		</div>
	);
}
