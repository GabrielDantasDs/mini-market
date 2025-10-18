"use client"

import { User, UserAction, UserReducer } from "@/reducers/userReducer";
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";

type UserContextType = {
	user: User | null;
	dispatch: React.Dispatch<UserAction>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {

	useEffect(() => {
		const cookie = document.cookie.split('; ').find(c => c.startsWith('auth_token='));

		const token = cookie?.split('=')[1];

		if (!token) return;

		try {
			const base64Url = to
		} catch (err) {

		}
	}, []);

	const [user, dispatch] = useReducer(UserReducer, null as User | null);

	const value = useMemo(() => ({ user, dispatch }), [user, dispatch]);
	console.log(value)
	return (
		<UserContext.Provider value={value}>{children}</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used inside UserProvider");
	return ctx;
}
