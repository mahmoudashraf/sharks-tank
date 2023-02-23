import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";

import { auth } from "../firebase-service";
import { isSessionValid } from "~/fb.sessions.server";
import { sessionLogout } from "../fb.sessions.server";

export async function loader({ request }) {
  const { decodedClaims, error } = await isSessionValid(request, "/login");
  const responseData = [];
  const data = {
    error,
    decodedClaims,
    responseData,
  };
  return json(data);
}

export async function action({ request }) {
  return await sessionLogout(request);
}

export let meta = () => {
  return {
    title: "Egypt Business Hub",
    description: "Welcome to Egypt Business Hub!",
  };
};

export default function Index() {
  const logoutFetcher = useFetcher();
  const data = useLoaderData();
  let greeting = data?.decodedClaims
    ? "Logged In As: " + data?.decodedClaims?.email
    : "Log In My: friend";

  const logout = async () => {
    await auth.signOut();
    logoutFetcher.submit({}, { method: "POST" });
  };

  return (
    <div className="ui centered container" style={{ paddingTop: 40 }}>
      <div className="ui segment">
        <h3>{greeting}</h3>
        <div>
          <button className="ui button" type="button" onClick={() => logout()}>
            LOGOUT
          </button>
        </div>
      </div>
      <div className="ui segment">
        <div className="ui medium header">User Authentication Information</div>
        <p>Name: {data?.decodedClaims?.name || "** Name Missing **"}</p>
        <p>Email: {data?.decodedClaims?.email}</p>
        <p>Login Using: {data?.decodedClaims?.firebase?.sign_in_provider}</p>
      </div>
    </div>
  );
}
