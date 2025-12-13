# QR Code Based Entry–Exit API (Summary)

## Overview

This system implements a **single QR-code–based API endpoint** to handle both **entry** and **exit** for students. The QR code contains **encrypted JSON data**, which is decrypted on the server and processed based on a `type` field.

The implementation combines:

* Encryption & decryption logic
* QR payload validation
* Entry/exit decision logic
* Database logging

All of this is handled inside **one Express route file**.

---

## Encryption Logic (Important)

* Algorithm used: **AES-256-CBC**
* IV: Random 16 bytes per encryption
* Output format:

  ```
  base64(iv):base64(ciphertext)
  ```

### ⚠️ Mandatory Rule

**You must stringify JSON before encrypting it.**

Correct:

```js
encrypt(JSON.stringify(payload))
```

Wrong:

```js
encrypt(payload) // ❌ becomes "[object Object]"
```

If you don’t stringify:

* Decryption will succeed
* `JSON.parse()` will fail
* The API will reject the request

---

## QR Payload Structure (Before Encryption)

```json
{
  "roll": "23CS30012",
  "type": "entry", // or "exit"
  "laptop": true,
  "books": ["DSA", "OS"]
}
```

This JSON is:

1. Stringified
2. Encrypted
3. Stored inside a QR code

---

## API Endpoint Usage

### Endpoint

```
POST /qrcode
```

### Request Body

```json
{
  "data": "<encrypted_qr_string>"
}
```

Where `data` is the encrypted string generated from the payload.

---

## Server-side Flow

1. Receive encrypted QR data
2. Decrypt it using AES-256-CBC
3. Parse decrypted string into JSON
4. Validate roll number format
5. Check `type`

   * `entry` → log entry if not already inside
   * `exit` → calculate duration and log exit
6. Store data in database

---

## Entry Rules

* A student **cannot enter twice without exiting**
* Latest entry and exit timestamps are compared
* Laptop and books info is stored on entry

---

## Exit Rules

* Exit is allowed **only after a valid entry**
* Prevents double exit
* Stay duration is calculated and stored

---

## Environment Requirements

### `.env`

```
ENCRYPT_KEY=<64-hex-character-key>
```

Generate securely:

```bash
openssl rand -hex 32
```

The same key **must be used for encryption and decryption**.

---

## Notes & Limitations

* AES-256-CBC **does not provide tamper detection**
* Payload can decrypt into garbage if modified
* For production or public deployment:

  * Prefer **AES-256-GCM** or
  * Add HMAC verification

---

## Final Takeaway

* One endpoint handles both entry and exit
* QR contains encrypted, not plain, data
* **JSON.stringify before encryption is non-negotiable**
* API usage is simple and deterministic

This setup is sufficient for controlled environments like campus systems.
