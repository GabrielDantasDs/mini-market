"use client";

import { User, UserAction, UserReducer } from "@/reducers/userReducer";
import { parseUserFromJWT } from "@/utils/decoders";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";

type UserContextType = {
	user: User | null;
	dispatch: React.Dispatch<UserAction>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const cookie = typeof document !== "undefined"
		? document.cookie.split("; ").find((c) => c.startsWith("auth_token="))
		: undefined;

	const token = cookie?.split("=")[1];

	const [user, dispatch] = useReducer(UserReducer, null as User | null);

	useEffect(() => {
		if (!token) return;
		try {
			const parsed = parseUserFromJWT(token);
			console.log(parsed)
			if (parsed) dispatch({ type: "LOGIN", user: parsed });
		} catch (err) {
			console.error("Failed to parse user from token:", err);
		}
	}, []);

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
