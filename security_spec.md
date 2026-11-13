# Security Specification — Oeste Sombrio Character Sheets

## 1. Data Invariants
- Every document in `/characters/{characterId}` MUST have a valid `characterId` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
- Every character sheet belongs strictly to one authenticated, email-verified user (`ownerId == request.auth.uid`).
- Users may ONLY read (`get`, `list`), create, update, or delete their own character sheets.
- `ownerId` and `createdAt` are immutable after creation.
- `createdAt` (on create) and `updatedAt` (on create and update) MUST equal `request.time`.
- All strings have explicit upper bounds matching `firebase-blueprint.json` (`nome <= 100`, `nivel <= 30`, `equipamentos <= 4000`, etc.).
- `fadiga` MUST be an integer in `0..10`.
- `tambor` MUST match `^[01]{6}$`.
- `pericias` MUST be a map containing exclusively the 19 defined skill keys, each holding one of `['', 'd4', 'd6', 'd8', 'd10', 'd12']`.
- Combat dice (`armaCurtaDado`, `armaLongaDado`, `corpoACorpoDado`) MUST be one of `['', 'd4', 'd6', 'd8', 'd10', 'd12']`.

## 2. The "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated read/write**: `auth == null` reading or writing `/characters/char1`.
2. **Unverified email write**: `auth.token.email_verified == false` creating a sheet.
3. **Identity Spoofing on create**: `ownerId` set to another user's UID (`"victim-uid"`).
4. **Shadow/Ghost field on create**: Adding `"isAdmin": true` or `"ghostField": 123`.
5. **Shadow/Ghost field on update**: Attempting `updateDoc` with `"ownerId"` or `"extraField"`.
6. **Immutability bypass**: Attempting to change `ownerId` or `createdAt` on update.
7. **Timestamp forgery**: Supplying client-side `new Date()` instead of `serverTimestamp()` (`request.time`).
8. **ID Poisoning**: Document ID containing spaces, slashes, or >128 chars.
9. **Resource Exhaustion (DoW)**: `equipamentos` exceeding 4000 characters or `nome` exceeding 100 characters.
10. **Out-of-bounds integer**: Setting `fadiga: 99` or `fadiga: -1` or `fadiga: "5"`.
11. **Invalid die enum / skill key poisoning**: Setting `pericias.hacked = "d20"` or `armaCurtaDado = "d100"`.
12. **Cross-user list scraping**: Listing `/characters` without filtering `where('ownerId', '==', auth.uid)`.
