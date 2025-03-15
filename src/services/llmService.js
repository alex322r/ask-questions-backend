import { Ollama } from "ollama";
import Groq from "groq-sdk";

export const ollama = new Ollama({host: "http://localhost:11434"});

export const groq = new Groq({apiKey: process.env.GROQ_API_KEY});