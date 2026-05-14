/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

const ENCODER = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    ENCODER.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  const hashArray = new Uint8Array(hashBuffer);
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(hashArray).map((b) => b.toString(16).padStart(2, "0")).join("");

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  
  const saltHex = parts[0];
  const hashHex = parts[1];

  const saltMatch = saltHex.match(/.{1,2}/g);
  if (!saltMatch) return false;
  
  const salt = new Uint8Array(saltMatch.map((byte) => parseInt(byte, 16)));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    ENCODER.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  const hashArray = new Uint8Array(hashBuffer);
  const verifyHashHex = Array.from(hashArray).map((b) => b.toString(16).padStart(2, "0")).join("");

  return verifyHashHex === hashHex;
}
