import { users, type User, type InsertUser, resumeAnalyses, type ResumeAnalysis, type InsertResumeAnalysis } from "@shared/schema";
import session from "express-session";
import MemoryStoreFactory from "memorystore";

const MemoryStore = MemoryStoreFactory(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getResumeAnalysis(id: number): Promise<ResumeAnalysis | undefined>;
  createResumeAnalysis(analysis: InsertResumeAnalysis): Promise<ResumeAnalysis>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyses: Map<number, ResumeAnalysis>;
  sessionStore: session.Store;
  private currentUserId: number = 1;
  private currentAnalysisId: number = 1;

  constructor() {
    this.users = new Map();
    this.analyses = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getResumeAnalysis(id: number): Promise<ResumeAnalysis | undefined> {
    return this.analyses.get(id);
  }

  async createResumeAnalysis(insertAnalysis: InsertResumeAnalysis): Promise<ResumeAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: ResumeAnalysis = { ...insertAnalysis, id, createdAt: new Date() };
    this.analyses.set(id, analysis);
    return analysis;
  }
}

export const storage = new MemStorage();
