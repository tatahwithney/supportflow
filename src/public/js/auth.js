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

/* ---------- Shared UI helpers ---------- */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function statusBadge(status) {
    const value = String(status || "unknown");

    return `<span class="badge status-${escapeHtml(value)}">${escapeHtml(value.replace(/-/g, " "))}</span>`;
}

function priorityBadge(priority) {
    const value = String(priority || "medium");

    return `<span class="badge priority-${escapeHtml(value)}">${escapeHtml(value)} priority</span>`;
}

function formatDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function requestCardHtml(request, href, cta, extra) {
    return `
        <article class="card req-card">
            <div class="badges">
                ${statusBadge(request.status)}
                ${priorityBadge(request.priority)}
            </div>
            <h3>${escapeHtml(request.title)}</h3>
            <p class="clamp">${escapeHtml(request.description)}</p>
            <div class="req-foot">
                <span class="meta">${extra || ""}</span>
                <a class="btn btn-secondary btn-sm" href="${href}">${cta}</a>
            </div>
        </article>
    `;
}

function renderStats(element, requests) {
    if (!element) {
        return;
    }

    const count = status =>
        requests.filter(item => item.status === status).length;

    const items = [
        ["Total", requests.length],
        ["Open", count("open")],
        ["In progress", count("in-progress")],
        ["Resolved", count("resolved")]
    ];

    element.innerHTML = items.map(([label, value]) => `
        <div class="stat">
            <span class="stat-label">${label}</span>
            <strong class="stat-value">${value}</strong>
        </div>
    `).join("");
}

/* ---------- Chat (WhatsApp style) ---------- */

function chatDayLabel(date) {
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function renderChat(items) {
    const payload = getTokenPayload();
    const myId = payload ? String(payload.userId) : null;

    let lastDay = "";
    let lastSender = "";

    return items.map(item => {
        const sender = item.sender || {};
        const senderId = String(sender._id);
        const mine = senderId === myId;
        const date = new Date(item.createdAt);
        const dayKey = date.toDateString();
        let html = "";

        if (dayKey !== lastDay) {
            html += `<div class="day"><span>${escapeHtml(chatDayLabel(date))}</span></div>`;
            lastDay = dayKey;
            lastSender = "";
        }

        const first = senderId !== lastSender;
        lastSender = senderId;

        const time = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

        html += `
            <div class="msg ${mine ? "mine" : "theirs"}${first ? " first" : ""}">
                <div class="bubble">
                    ${!mine && first ? `<div class="who">~ ${escapeHtml(sender.name)}</div>` : ""}
                    <span class="txt">${escapeHtml(item.message)}</span>
                    <span class="time">${escapeHtml(time)}</span>
                </div>
            </div>
        `;

        return html;
    }).join("");
}

function scrollChat() {
    const element = document.getElementById("responses");

    if (element) {
        element.scrollTop = element.scrollHeight;
    }
}

function setChatHeader(name, subtitle) {
    const nameElement = document.getElementById("chatName");
    const subElement = document.getElementById("chatSub");
    const avatar = document.getElementById("chatAvatar");

    if (nameElement) {
        nameElement.textContent = name;
    }

    if (subElement) {
        subElement.textContent = subtitle || "";
    }

    if (avatar) {
        avatar.textContent = String(name || "S").trim().charAt(0).toUpperCase();
    }
}

/* ---------- Page behaviours ---------- */

document.addEventListener("DOMContentLoaded", () => {
    /* Show / hide password */
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-toggle-password]");

        if (!button) {
            return;
        }

        const input = document.getElementById(button.dataset.togglePassword);

        if (!input) {
            return;
        }

        const show = input.type === "password";

        input.type = show ? "text" : "password";
        button.textContent = show ? "Hide" : "Show";
        button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });

    /* Toast messages clear themselves */
    document.querySelectorAll(".toast").forEach(element => {
        let timer;

        new MutationObserver(() => {
            clearTimeout(timer);

            if (element.textContent.trim()) {
                timer = setTimeout(() => {
                    element.textContent = "";
                }, 4500);
            }
        }).observe(element, {
            childList: true,
            characterData: true,
            subtree: true
        });
    });

    /* Chat composer: auto-grow, Enter to send */
    const composer = document.getElementById("responseMessage");

    if (composer) {
        const form = composer.closest("form");

        const grow = () => {
            composer.style.height = "auto";
            composer.style.height = `${Math.min(composer.scrollHeight, 120)}px`;
        };

        composer.addEventListener("input", grow);

        composer.addEventListener("keydown", event => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();

                if (composer.value.trim()) {
                    form.requestSubmit();
                }
            }
        });

        form.addEventListener("submit", () => {
            setTimeout(grow, 400);
        });
    }

    /* Storage notice */
    const notice = document.getElementById("storageNotice");

    if (notice) {
        let acknowledged = false;

        try {
            acknowledged = localStorage.getItem("sfNoticeAck") === "1";
        } catch (error) {
            acknowledged = false;
        }

        notice.hidden = acknowledged;

        const button = document.getElementById("storageNoticeClose");

        if (button) {
            button.addEventListener("click", () => {
                notice.hidden = true;

                try {
                    localStorage.setItem("sfNoticeAck", "1");
                } catch (error) {
                    /* ignore */
                }
            });
        }
    }
});
