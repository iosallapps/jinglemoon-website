# JingleMoon site: claims and sources

Redesign 2026-11-09: velvet, pine and gold sections, self-hosted fonts (Playfair Display, Manrope, OFL, in /fonts), app art converted to WebP with srcset, snowfall canvas, scroll reveal, parallax pine branches, a live countdown and a tap-to-shake snow globe toy. No frameworks, no tracking, no external requests.

Every claim on index.html, checked against ~/Developer/santa-app on 2026-11-09:

| Claim | Source in the app |
| --- | --- |
| Practice Flight any day, live flight in the flight window, close-up on Apple Maps | Features/Home/HomeViewModel.swift (HomeMainFlight), Features/Tracker |
| Pick a city, no location asked | privacy.html, city picker |
| Home Screen widgets, Lock Screen countdown | JingleMoonWidget, support.html |
| Route simulated for fun | terms.html |
| Chat replies written in advance; on-device model in reviewed languages | Core/Chat/ScriptedTree.swift, FoundationChatEngine.swift |
| Sample chat lines | Localizable.xcstrings scripted.reindeerFly.chip / reply1, scripted.reindeerFood.chip, whenComes.chip, cookies.chip |
| Worried messages point to a trusted grown-up | Core/Chat/SupportRoute.swift, privacy.html |
| Pretend letter delivery, Nice List certificate, shared by a grown-up | terms.html, privacy.html |
| Keepsake, reindeer, Visit, Magic Kit, advent, snow globe copy | Core/Shop/ShopCopy.swift, ShopCatalog.swift (8 reindeer, 6 globes, 24 doors) |
| One-time gifts, no subscription | terms.html (Santa's Workshop) |
| No ads, no tracking, no account, grown-ups check list | privacy.html (Children), commit 861a3e9 |
| 45 languages | Localizable.xcstrings: 45 languages, all 793 strings translated |
| iPhone and iPad | TARGETED_DEVICE_FAMILY = "1,2" |
| Countdown | the site counts to 00:00 on 24 December in the visitor's time zone (labelled "Christmas Eve begins in") |

Not added: app-ads.txt. The app shows no ads, so there is no ad seller to authorise.

The App Store badge is not a link yet (id 6829834796 is not live). When it is, turn the two `.soon` notes into links to https://apps.apple.com/app/id6829834796.

Legal pages: privacy, terms and support keep their exact wording and headings; only the layout changed.
