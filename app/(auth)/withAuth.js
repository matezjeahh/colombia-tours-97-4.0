// app/auth/withAuth.js
import React from "react";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "@/config";

const withAuth = (Component) => {
  const AuthenticatedComponent = async (props) => {
    const tokenCookies = cookies();

    // Ensure the cookies are properly passed to getTokens
    const tokens = await getTokens(tokenCookies, {
      apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      serviceAccount: serverConfig.serviceAccount,
    });

    if (!tokens) {
      notFound();
      return null; // Ensure you return null after notFound()
    }

    // Pass tokens and other necessary data to the component
    return <Component {...props} tokens={tokens} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
