import type { Express } from "express";

export function createCloudServer(options?: { dataFile?: string }): Express;
