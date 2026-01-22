( () => {
    let e = null
      , t = null
      , o = []
      , n = [];
    const s = ExtPay("discord-emoji-sticker-downloader");
    let c = !1;
    const d = {
        host: "https://discord.com/api/v10",
        emojis: e => `/guilds/${e}/emojis`,
        guilds: "/users/@me/guilds",
        guild: e => `/guilds/${e}`,
        request: async (e, t, o) => await fetch(d.host + t, {
            method: e,
            headers: {
                Authorization: o
            }
        })
    }
      , i = (e, t=!1) => `https://cdn.discordapp.com/emojis/${e}.${t ? "gif" : "png"}?v=1`
      , l = e => `https://media.discordapp.net/stickers/${e}.png?size=1024`
      , r = (e, t) => {
        const o = e.name.toLowerCase()
          , n = t.name.toLowerCase();
        return o < n ? -1 : o > n ? 1 : 0
    }
    ;
    function a(e) {
        const t = document.getElementById("promo-banner")
          , o = document.getElementById("premium-badge")
          , n = document.getElementById("limit-info");
        e ? (t && (t.style.display = "none"),
        o && (o.style.display = "block"),
        n && (n.style.display = "flex",
        n.className = "limit-info limit-info-pro",
        n.innerHTML = "💎 Pro Active: Unlimited Downloads")) : (t && (t.style.display = "block"),
        n && (n.style.display = "block",
        n.className = "limit-info limit-info-free",
        n.innerHTML = '🔒 Free Limit: 10 items/batch <span class="upgrade-link">Unlock Unlimited ⚡</span>'))
    }
    function m() {
        document.getElementById("loading-overlay").style.display = "flex"
    }
    function u() {
        document.getElementById("loading-overlay").style.display = "none"
    }
    function g(e, t) {
        const o = document.getElementById("success-message")
          , n = document.getElementById("error-message");
        "success" === e ? (o.textContent = t,
        o.style.display = "block",
        n.style.display = "none",
        setTimeout( () => o.style.display = "none", 5e3)) : (n.textContent = t,
        n.style.display = "block",
        o.style.display = "none",
        setTimeout( () => n.style.display = "none", 5e3))
    }
    function y(e, t=!1) {
        const o = document.getElementById("status-bar");
        document.getElementById("status-text").textContent = e,
        t ? (o.classList.add("status-error"),
        o.classList.remove("status-connected")) : e.includes("Connected") ? (o.classList.add("status-connected"),
        o.classList.remove("status-error")) : o.classList.remove("status-connected", "status-error")
    }
    function p() {
        let e = 0;
        return document.querySelectorAll("#emoji-grid .grid-item.selected").forEach( () => e++),
        document.querySelectorAll("#sticker-grid .grid-item.selected").forEach( () => e++),
        document.getElementById("download-btn-text").textContent = e > 0 ? `Download ${e} Items` : "Download All",
        e
    }
    function E(e, t, o) {
        const n = document.getElementById(e);
        n.innerHTML = "",
        t.forEach(e => {
            const t = document.createElement("div");
            t.className = "grid-item selected",
            t.dataset.id = e.id;
            const s = document.createElement("img");
            s.src = "emoji" === o ? i(e.id, e.animated) : l(e.id),
            s.alt = e.name,
            s.title = e.name,
            t.appendChild(s),
            t.addEventListener("click", () => {
                t.classList.toggle("selected"),
                f(o),
                p()
            }
            ),
            n.appendChild(t)
        }
        )
    }
    function f(e) {
        const t = `${e}-grid`
          , o = `${e}-count`
          , n = document.querySelectorAll(`#${t} .grid-item`).length
          , s = document.querySelectorAll(`#${t} .grid-item.selected`).length;
        document.getElementById(o).textContent = `${s}/${n}`
    }
    function h(e, t) {
        const o = e.querySelector(".custom-select-trigger span")
          , n = e.querySelectorAll(".custom-option.selected");
        if (0 === n.length)
            o.textContent = "server-select" === e.id ? "Select Server" : "None Selected";
        else if (t) {
            const t = e.querySelectorAll(".custom-option").length;
            o.textContent = n.length === t ? "All Selected" : `${n.length} Selected`
        } else
            o.textContent = n[0].textContent.trim()
    }
    async function k(s) {
        try {
            m(),
            y("Loading server data..."),
            document.getElementById("emoji-group").style.display = "none",
            document.getElementById("sticker-group").style.display = "none",
            document.getElementById("download-btn").style.display = "none";
            const c = await d.request("GET", d.guild(s), e);
            if (!c.ok)
                throw new Error("Failed to fetch server data");
            t = await c.json(),
            o = function(e) {
                if (!e)
                    return [];
                const t = {}
                  , o = [];
                return e.forEach(e => {
                    const n = e.name
                      , s = t[n] || 0;
                    t[n] = s + 1,
                    s > 0 && (e = {
                        ...e,
                        name: `${n}~${s}`,
                        originalName: n
                    }),
                    o.push(e)
                }
                ),
                o
            }(t.emojis || []).sort(r),
            n = (t.stickers || []).sort(r),
            o.length > 0 && (E("emoji-grid", o, "emoji"),
            document.getElementById("emoji-group").style.display = "block",
            f("emoji")),
            n.length > 0 && (E("sticker-grid", n, "sticker"),
            document.getElementById("sticker-group").style.display = "block",
            f("sticker")),
            (o.length > 0 || n.length > 0) && (document.getElementById("download-btn").style.display = "flex",
            p()),
            y(`✅ Loaded ${o.length} emojis and ${n.length} stickers`),
            u()
        } catch (e) {
            console.error("Error loading guild data:", e),
            g("error", e.message),
            u()
        }
    }
    document.addEventListener("DOMContentLoaded", async () => {
        if (s.getUser().then(e => {
            console.log("ExtPay User:", e),
            c = e.paid,
            a(c)
        }
        ).catch(e => {
            console.error("ExtPay Error:", e),
            a(!1)
        }
        ),
        !await async function() {
            return new Promise(e => {
                chrome.tabs.query({
                    active: !0,
                    currentWindow: !0
                }, t => {
                    t[0] && t[0].url && t[0].url.includes("discord.com") ? e(!0) : e(!1)
                }
                )
            }
            )
        }())
            return document.getElementById("discord-redirect").style.display = "flex",
            void (document.getElementById("main-content").style.display = "none");
        document.getElementById("discord-redirect").style.display = "none",
        document.getElementById("main-content").style.display = "flex",
        y("Getting Discord token...");
        const t = await async function() {
            return new Promise(e => {
                chrome.tabs.query({
                    active: !0,
                    currentWindow: !0
                }, t => {
                    t[0] ? chrome.tabs.sendMessage(t[0].id, {
                        action: "getToken"
                    }, t => {
                        chrome.runtime.lastError ? e({
                            error: "Failed to communicate with Discord page"
                        }) : e(t || {
                            error: "No response from page"
                        })
                    }
                    ) : e({
                        error: "No active tab found"
                    })
                }
                )
            }
            )
        }();
        if (t.error || !t.success)
            return y("Failed to connect to Discord", !0),
            void g("error", t.error || "Please refresh the Discord page and try again");
        e = t.token,
        await async function() {
            try {
                m(),
                y("Fetching server list...");
                const t = await d.request("GET", d.guilds, e);
                if (!t.ok)
                    throw new Error(401 === t.status ? "Invalid token" : "Failed to fetch server list");
                !function(e, t, o) {
                    const n = document.getElementById("server-select")
                      , s = n.querySelector(".custom-select-trigger")
                      , c = n.querySelector(".custom-options")
                      , d = c.classList.contains("multiple");
                    c.innerHTML = "",
                    t.forEach(e => {
                        const t = document.createElement("div");
                        t.className = "custom-option",
                        e.selected && t.classList.add("selected"),
                        t.dataset.value = e.value,
                        t.innerHTML = e.name,
                        t.addEventListener("click", s => {
                            s.stopPropagation(),
                            d ? (t.classList.toggle("selected"),
                            h(n, d)) : (n.querySelectorAll(".custom-option").forEach(e => e.classList.remove("selected")),
                            t.classList.add("selected"),
                            n.classList.remove("open"),
                            h(n, d)),
                            o && o(e.value)
                        }
                        ),
                        c.appendChild(t)
                    }
                    );
                    const i = s.cloneNode(!0);
                    s.parentNode.replaceChild(i, s),
                    i.addEventListener("click", () => {
                        n.classList.toggle("open")
                    }
                    ),
                    document.addEventListener("click", e => {
                        n.contains(e.target) || n.classList.remove("open")
                    }
                    ),
                    h(n, d)
                }(0, (await t.json()).sort(r).map(e => ({
                    name: e.icon ? `<img src="https://cdn.discordapp.com/icons/${e.id}/${e.icon}.png"/> ${e.name}` : e.name,
                    value: e.id,
                    selected: !1
                })), k),
                y("✅ Connected to Discord"),
                u()
            } catch (e) {
                console.error("Error loading guilds:", e),
                y("Connection failed", !0),
                g("error", e.message),
                u()
            }
        }(),
        ["emoji", "sticker"].forEach(e => {
            document.getElementById(`${e}-select-all`).addEventListener("click", () => {
                document.querySelectorAll(`#${e}-grid .grid-item`).forEach(e => e.classList.add("selected")),
                f(e),
                p()
            }
            ),
            document.getElementById(`${e}-select-none`).addEventListener("click", () => {
                document.querySelectorAll(`#${e}-grid .grid-item`).forEach(e => e.classList.remove("selected")),
                f(e),
                p()
            }
            )
        }
        )
    }
    ),
    document.getElementById("open-discord").addEventListener("click", () => {
        chrome.runtime.sendMessage({
            action: "openDiscord"
        }),
        window.close()
    }
    ),
    document.getElementById("download-btn").addEventListener("click", async function() {
        try {
            const e = p();
            if (!c && e > 10)
                return document.getElementById("modal-count").textContent = e,
                void (document.getElementById("upgrade-modal").style.display = "flex");
            m(),
            y("Downloading...");
            const s = Array.from(document.querySelectorAll("#emoji-grid .grid-item.selected")).map(e => e.dataset.id)
              , d = Array.from(document.querySelectorAll("#sticker-grid .grid-item.selected")).map(e => e.dataset.id);
            if (0 === s.length && 0 === d.length)
                throw new Error("Please select at least one emoji or sticker");
            const r = o.filter(e => s.includes(e.id))
              , a = n.filter(e => d.includes(e.id))
              , E = new JSZip
              , f = E.folder("Emojis")
              , h = E.folder("Stickers");
            let k = 0;
            for (const e of r)
                try {
                    let t = await fetch(i(e.id, e.animated));
                    t.ok || (console.log(`Emoji ${e.id} blocked by CORS, trying proxy`),
                    t = await fetch(`https://corsproxy.io/?${i(e.id, e.animated)}`));
                    const o = await t.blob();
                    f.file(`${e.name}.${e.animated ? "gif" : "png"}`, o),
                    k++
                } catch (t) {
                    console.error(`Failed to download emoji ${e.name}:`, t)
                }
            let v = 0;
            for (const e of a)
                try {
                    let t = await fetch(l(e.id));
                    t.ok || (console.log(`Sticker ${e.id} blocked by CORS, trying proxy`),
                    t = await fetch(`https://corsproxy.io/?${l(e.id)}`));
                    const o = await t.blob();
                    h.file(`${e.name}.png`, o),
                    v++
                } catch (t) {
                    console.error(`Failed to download sticker ${e.name}:`, t)
                }
            const w = await E.generateAsync({
                type: "blob"
            })
              , L = t.name.replace(/\s/g, "_").replace(/\W/g, "")
              , $ = URL.createObjectURL(w)
              , b = document.createElement("a");
            b.href = $,
            b.download = `Emojis_${L}.zip`,
            document.body.appendChild(b),
            b.click(),
            document.body.removeChild(b),
            URL.revokeObjectURL($),
            y("✅ Download completed"),
            g("success", `Downloaded ${k} emojis and ${v} stickers!`),
            u()
        } catch (e) {
            console.error("Download error:", e),
            g("error", e.message),
            u()
        }
    });
    const v = () => s.openPaymentPage();
    document.getElementById("modal-upgrade-btn").addEventListener("click", v),
    document.getElementById("promo-banner").addEventListener("click", v),
    document.getElementById("limit-info").addEventListener("click", e => {
        e.preventDefault(),
        c || v()
    }
    );
    const w = () => document.getElementById("upgrade-modal").style.display = "none";
    document.querySelector(".close-modal").addEventListener("click", w),
    window.addEventListener("click", e => {
        "upgrade-modal" === e.target.id && w()
    }
    )
}
)();
