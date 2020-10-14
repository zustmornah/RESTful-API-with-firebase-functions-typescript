import { Request, Response } from "express";
import * as admin from "firebase-admin";

export async function create(req: Request, res: Response) {
	try {
		const { displayName, password, email, role } = req.body;

		if (!displayName || !password || !email || !role) {
			return res.status(400).send({ message: "Missing fields" });
		}

		const { uid } = await admin.auth().createUser({
			displayName,
			password,
			email,
		});
		await admin.auth().setCustomUserClaims(uid, { role });

		return res.status(201).send({ uid });
	} catch (err) {
		return handleError(res, err);
	}
}

export async function all(req: Request, res: Response) {
	try {
		const listUsers = await admin.auth().listUsers();
		const users = listUsers.users.map(mapUser);
		return res.status(200).send({ users });
	} catch (err) {
		return handleError(res, err);
	}
}

function mapUser(user: admin.auth.UserRecord) {
	const customClaims = (user.customClaims || { role: "" }) as {
		role?: string;
	};
	const role = customClaims.role ? customClaims.role : "";
	return {
		uid: user.uid,
		email: user.email || "",
		displayName: user.displayName || "",
		role,
		lastSignInTime: user.metadata.lastSignInTime,
		creationTime: user.metadata.creationTime,
	};
}

export async function get(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const user = await admin.auth().getUser(id);
		return res.status(200).send({ user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}

export async function patch(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { displayName, email } = req.body;

		if (!id) {
			return res.status(400).send({ message: "No user ID in url param" });
		}
		if (!displayName) {
			return res.status(400).send({ message: "displayName field is required" });
		}
		if (!email) {
			return res.status(400).send({ message: "email field is required" });
		}

		await admin.auth().updateUser(id, { displayName, email });
		const user = await admin.auth().getUser(id);

		return res.status(200).send({ message: "Update Successful", user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}

export async function patch_userpass(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { password } = req.body;

		if (!id) {
			return res.status(400).send({ message: "No user ID in url param" });
		}
		if (!password) {
			return res.status(400).send({ message: "password field required" });
		}

		await admin.auth().updateUser(id, { password });
		const user = await admin.auth().getUser(id);

		return res.status(200).send({ message: "Update Successful", user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}

export async function patch_userRole(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const { role } = req.body;

		if (!id) {
			return res.status(400).send({ message: "No user ID in url param" });
		}
		if (!role) {
			return res.status(400).send({ message: "No user role specified in request body" });
		}

		await admin.auth().setCustomUserClaims(id, { role });
		const user = await admin.auth().getUser(id);

		return res.status(200).send({ message: "Update Successful", user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}

export async function remove(req: Request, res: Response) {
	try {
		const { id } = req.params;
		await admin.auth().deleteUser(id);
		return res.status(204).send({});
	} catch (err) {
		return handleError(res, err);
	}
}

function handleError(res: Response, err: any) {
	return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
