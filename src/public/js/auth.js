function getToken() {
    return localStorage.getItem("token");
}

function getTokenPayload() {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];

        return JSON.parse(
            atob(
                payload
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            )
        );
    } catch (error) {
        return null;
    }
}

function getUserRole() {
    const payload = getTokenPayload();

    return payload ? payload.role : null;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("authPortal");

    window.location.href = "/";
}

function handleUnauthorized() {
    const portal =
        localStorage.getItem("authPortal");

    localStorage.removeItem("token");
    localStorage.removeItem("authPortal");

    if (portal === "staff") {
        window.location.href = "/staff/login";
    } else {
        window.location.href = "/customer/login";
    }
}