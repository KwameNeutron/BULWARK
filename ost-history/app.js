// Treaty in the Papers: static prototype. Data comes from data/*.json, or from
// window.OST_DATA when the page has been bundled into a single file.
(function () {
  "use strict";

  var FILES = ["events", "articles", "leads", "documents", "people", "places", "treaty", "sources", "rights"];
  var PHASES = {
    origins: { label: "Origins", color: "var(--ph-origins)" },
    declaration: { label: "UN declarations", color: "var(--ph-declaration)" },
    negotiation: { label: "Negotiation", color: "var(--ph-negotiation)" },
    signature: { label: "Signature", color: "var(--ph-signature)" },
    aftermath: { label: "Entry into force", color: "var(--ph-aftermath)" }
  };
  var VIEWS = ["timeline", "treaty", "sources", "about"];
  var D = {};
  var byId = {};

  function load() {
    if (window.OST_DATA) return Promise.resolve(window.OST_DATA);
    return Promise.all(FILES.map(function (f) {
      return fetch("data/" + f + ".json").then(function (r) {
        if (!r.ok) throw new Error("data/" + f + ".json: HTTP " + r.status);
        return r.json();
      });
    })).then(function (parts) {
      var out = {};
      FILES.forEach(function (f, i) { out[f] = parts[i]; });
      return out;
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var MONTHS = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  function fmtDate(iso) {
    var p = iso.split("-");
    if (p.length < 3) return iso;
    return MONTHS[+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
  }
  function yearFrac(iso) {
    var p = iso.split("-").map(Number);
    return p[0] + ((p[1] || 1) - 1) / 12 + ((p[2] || 1) - 1) / 365;
  }
  function $(id) { return document.getElementById(id); }

  // ---- Timeline axis (SVG, one linear scale) ----
  function drawAxis() {
    var svg = $("axis");
    var x0 = 40, x1 = 960, y = 70, start = 1957, end = 1968;
    var sx = function (t) { return x0 + (t - start) / (end - start) * (x1 - x0); };
    var parts = ['<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="var(--rule)" stroke-width="2"/>'];
    for (var yr = start; yr <= end; yr++) {
      var x = sx(yr);
      parts.push('<line x1="' + x + '" y1="' + (y - 5) + '" x2="' + x + '" y2="' + (y + 5) + '" stroke="var(--muted)"/>');
      parts.push('<text x="' + x + '" y="' + (y + 24) + '" font-size="12" text-anchor="middle">' + yr + "</text>");
    }
    // clippings as small ticks above the line
    D.articles.forEach(function (a) {
      var x = sx(yearFrac(a.date));
      parts.push('<rect x="' + (x - 1.5) + '" y="' + (y - 34) + '" width="3" height="14" fill="var(--muted)" opacity="0.7"><title>' + esc(a.outlet + ", " + fmtDate(a.date)) + "</title></rect>");
    });
    D.events.forEach(function (e) {
      var x = sx(yearFrac(e.date));
      parts.push('<g class="ev-dot" data-ev="' + esc(e.id) + '" style="cursor:pointer" tabindex="0" role="button" aria-label="' + esc(fmtDate(e.date) + ": " + e.title) + '">' +
        '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + PHASES[e.phase].color + '" stroke="var(--sheet)" stroke-width="2"/>' +
        "<title>" + esc(fmtDate(e.date) + " · " + e.title) + "</title></g>");
    });
    parts.push('<text x="' + x0 + '" y="18" font-size="11">▮ press clipping   ● event</text>');
    svg.innerHTML = parts.join("");
    svg.querySelectorAll(".ev-dot").forEach(function (g) {
      var go = function () { var el = $(g.getAttribute("data-ev")); if (el) el.scrollIntoView({ block: "start" }); };
      g.addEventListener("click", go);
      g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } });
    });
    $("legend").innerHTML = Object.keys(PHASES).map(function (k) {
      return '<span style="--c:' + PHASES[k].color + '">' + PHASES[k].label + "</span>";
    }).join("");
  }

  // ---- Clipping card ----
  function clip(a) {
    var rights = D.rights[a.rights] || { label: a.rights };
    var artChips = (a.treaty_articles || []).map(function (n) {
      return '<button type="button" class="chip art" data-goto-art="' + esc(n) + '">Art. ' + esc(n) + "</button>";
    }).join("");
    var statusChip = a.status === "verified"
      ? '<span class="chip ok">Verified ' + esc(a.verified_on) + "</span>"
      : '<span class="chip flag">Partly verified: see note</span>';
    var lang = a.language === "nl" ? ' lang="nl"' : "";
    var html = '<article class="clip">' +
      '<div class="dateline"><b>' + esc(a.outlet) + "</b> · " + esc(a.outlet_place) + "<br>" + esc(fmtDate(a.date)) +
      (a.page ? " · p. " + esc(a.page) : "") + (a.wire ? " · " + esc(a.wire) : "") + "</div>" +
      "<h4" + lang + ">" + esc(a.headline) + "</h4>" +
      (a.headline_en ? '<p class="en">' + esc(a.headline_en) + "</p>" : "") +
      (a.deck ? '<p class="meta">' + esc(a.deck) + "</p>" : "") +
      (a.byline ? '<p class="meta">By ' + esc(a.byline) + "</p>" : "") +
      (a.excerpt ? "<blockquote" + lang + ">" + esc(a.excerpt) + "</blockquote>" : "") +
      (a.translation ? '<p class="tr">' + esc(a.translation) + "</p>" : "") +
      (a.excerpt_note ? '<p class="meta">' + esc(a.excerpt_note) + "</p>" : "") +
      '<div class="chips">' + statusChip + '<span class="chip" title="' + esc(rights.policy || "") + '">' + esc(rights.label) + "</span>" + artChips + "</div>" +
      '<a class="go" href="' + esc(a.archive_url) + '" target="_blank" rel="noopener">View page in ' + esc(archiveName(a.archive)) + " ↗</a>" +
      "</article>";
    return html;
  }
  function archiveName(id) {
    return { chronam: "Chronicling America", delpher: "Delpher" }[id] || id;
  }

  // ---- Timeline view ----
  function renderEvents() {
    var lang = $("f-lang").value, art = $("f-art").value, st = $("f-status").value;
    var shown = 0;
    var html = D.events.map(function (e) {
      var clips = D.articles.filter(function (a) {
        // each clipping appears once, under its first (primary) event
        return a.events.indexOf(e.id) === 0 &&
          (!lang || a.language === lang) &&
          (!art || (a.treaty_articles || []).indexOf(art) >= 0) &&
          (!st || a.status === st);
      });
      var filtering = lang || art || st;
      if (filtering && !clips.length) return "";
      shown += clips.length;
      var docs = (e.documents || []).map(function (id) {
        var d = byId[id];
        return d ? '<a class="doc-link" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.title.split(":")[0]) + " ↗</a>" : "";
      }).join("");
      var when = "<b>" + esc(fmtDate(e.date)) + "</b>" + (e.end_date ? "to " + esc(fmtDate(e.end_date)) + "<br>" : "") + esc(PHASES[e.phase].label);
      return '<div class="event" id="' + esc(e.id) + '" style="--pc:' + PHASES[e.phase].color + '">' +
        '<div class="when">' + when + "</div>" +
        '<div class="body"><h3>' + esc(e.title) + "</h3>" +
        '<p class="summary">' + esc(e.summary) + "</p>" +
        (e.date_note ? '<p class="note">' + esc(e.date_note) + "</p>" : "") +
        (docs ? '<div class="docs">' + docs + "</div>" : "") +
        (clips.length ? '<div class="clips">' + clips.map(clip).join("") + "</div>" : '<p class="note">No clipping seeded yet for this event.</p>') +
        "</div></div>";
    }).join("");
    $("events").innerHTML = html || '<p class="note">No clippings match these filters. Clear a filter to see more.</p>';
    $("count").textContent = shown + " of " + D.articles.length + " clippings shown";
  }

  // ---- Treaty view ----
  function renderTreaty() {
    $("articles").innerHTML = D.treaty.map(function (t) {
      var cov = D.articles.filter(function (a) { return (a.treaty_articles || []).indexOf(t.num) >= 0; });
      var list = cov.length
        ? "<ul>" + cov.map(function (a) {
            return '<li><a href="' + esc(a.archive_url) + '" target="_blank" rel="noopener">' + esc(a.outlet) + ", " + esc(fmtDate(a.date)) + "</a>: " + esc(a.headline_en || a.headline) + "</li>";
          }).join("") + "</ul>"
        : '<p class="none">No seeded coverage yet.</p>';
      return '<div class="tart" id="art-' + esc(t.num) + '"><div class="num">' + esc(t.num) + "</div>" +
        "<h4>" + esc(t.short) + "</h4><p>" + esc(t.gist) + "</p>" +
        (t.antecedent ? '<div class="ante">Antecedent: ' + esc(t.antecedent) + "</div>" : "") + list + "</div>";
    }).join("");
  }

  // ---- Sources view ----
  function renderSources() {
    $("sources-table").innerHTML = "<thead><tr><th>Archive</th><th>Coverage</th><th>Fit for this story</th><th>Access</th><th>Rights</th></tr></thead><tbody>" +
      D.sources.map(function (s) {
        return '<tr><td><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a>" +
          (s.verified ? "" : '<br><span class="chip flag">TO VERIFY</span>') + "</td><td>" + esc(s.coverage) + "</td><td>" + esc(s.ost_fit) +
          "</td><td>" + esc(s.access) + "</td><td>" + esc(s.rights) + "</td></tr>";
      }).join("") + "</tbody>";
  }

  // ---- About view ----
  function renderAbout() {
    var nVer = D.articles.filter(function (a) { return a.status === "verified"; }).length;
    var nPart = D.articles.length - nVer;
    var leads = D.leads.map(function (l) {
      return "<li><b>" + esc(l.outlet) + "</b>, " + esc(l.date) + ": " + esc(l.what) + " <em>" + esc(l.where_to_look) + ".</em> " + esc(l.note) + ' <span class="chip flag">' + esc(l.status) + "</span></li>";
    }).join("");
    var rights = Object.keys(D.rights).map(function (k) {
      return "<li><b>" + esc(D.rights[k].label)+ ".</b> " + esc(D.rights[k].policy) + "</li>";
    }).join("");
    $("about").innerHTML =
      "<h2>About &amp; method</h2>" +
      "<p>This prototype tells the story of the 1967 Outer Space Treaty through what newspapers printed at the time. Each clipping links to the page in a public archive. Nothing here is reproduced as an image; excerpts are a sentence or two, quoted for commentary.</p>" +
      "<h3>How citations were checked</h3>" +
      "<ol><li>Find candidate pages by keyword and date range through the archive's own search API (loc.gov JSON for Chronicling America; the KB SRU endpoint for Delpher).</li>" +
      "<li>Pull the archive's OCR text for the page or article and confirm the headline, date and passage are actually there.</li>" +
      "<li>Transcribe the excerpt from OCR, correcting only obvious OCR errors, and say so in the note.</li>" +
      "<li>Record anything that could not be confirmed as <b>TO VERIFY</b> or <b>partly verified</b>. No citation is invented to fill a gap.</li></ol>" +
      "<p>Status today: " + nVer + " clippings verified, " + nPart + " partly verified (passage confirmed, headline still to check against the page image), " + D.leads.length + " leads listed below as TO VERIFY.</p>" +
      '<div class="callout"><p>Coverage gap: Chronicling America ends in 1963, so 1966–67 coverage currently comes from Dutch papers on Delpher, which carried Reuters, AP, AFP and NYT wire copy. US and Soviet papers for 1966–67 are the first priority for phase 2.</p></div>' +
      "<h3>Rights policy</h3><ul>" + rights + "</ul>" +
      "<h3>Leads not yet verified</h3><ul>" + leads + "</ul>" +
      "<h3>A note on Resolution 1962</h3>" +
      "<p>The Declaration of Legal Principles is A/RES/1962 (XVIII), adopted at the 18th session on 13 December 1963. It is sometimes cited as (XVII); the 17th session ended in 1962.</p>";
  }

  // ---- Routing (plain #name only) ----
  function route() {
    var v = (location.hash || "#timeline").slice(1);
    if (VIEWS.indexOf(v) < 0) v = "timeline";
    VIEWS.forEach(function (name) { $("view-" + name).hidden = name !== v; });
    document.querySelectorAll("nav.tabs a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function wire() {
    ["f-lang", "f-art", "f-status"].forEach(function (id) { $(id).addEventListener("change", renderEvents); });
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-goto-art]");
      if (!b) return;
      location.hash = "#treaty";
      route();
      var el = $("art-" + b.getAttribute("data-goto-art"));
      if (el) el.scrollIntoView({ block: "start" });
    });
    window.addEventListener("hashchange", route);
  }

  load().then(function (data) {
    D = data;
    D.events.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    D.articles.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    D.documents.forEach(function (d) { byId[d.id] = d; });
    $("f-art").innerHTML += D.treaty.map(function (t) { return '<option value="' + t.num + '">Art. ' + t.num + " · " + esc(t.short) + "</option>"; }).join("");
    var dates = D.articles.map(function (a) { return a.verified_on; }).filter(Boolean).sort();
    $("checked").textContent = dates.length ? fmtDate(dates[dates.length - 1]) : "n/a";
    drawAxis(); renderEvents(); renderTreaty(); renderSources(); renderAbout();
    wire(); route();
  }).catch(function (err) {
    $("events").innerHTML = '<div class="callout"><p>Could not load the data files (' + esc(err.message) + "). Browsers block JSON loading from file:// pages; run <code>python3 -m http.server</code> in ost-history/ and open http://localhost:8000.</p></div>";
  });
})();
