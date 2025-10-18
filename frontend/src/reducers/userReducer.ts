export type User = {
    type: string
}

export type UserAction =
    | { type: "LOGIN"; user: User }
    | { type: "LOGOUT" };


export function UserReducer(state: User | null, action: UserAction): User|null {
	switch (action.type) {
		case "LOGIN":
			return action.user;
		case "LOGOUT":
			return null
    }
}