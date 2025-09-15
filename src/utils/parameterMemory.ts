import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface StoredParameters {
  generateCommand: {
    outputPath?: string;
    ip?: string;
    lastUsed?: string;
  };
  applyCommand: {
    configPath?: string;
    lastUsed?: string;
  };
}

const CONFIG_FILE_PATH = path.join(os.homedir(), '.config-dns-params.json');

export function loadStoredParameters(): StoredParameters {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Warning: Could not load stored parameters:', error);
  }
  
  return {
    generateCommand: {},
    applyCommand: {}
  };
}

export function saveGenerateParameters(outputPath: string, ip: string): void {
  try {
    const stored = loadStoredParameters();
    stored.generateCommand = {
      outputPath,
      ip,
      lastUsed: new Date().toISOString()
    };
    
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(stored, null, 2));
  } catch (error) {
    console.warn('Warning: Could not save generate parameters:', error);
  }
}

export function saveApplyParameters(configPath: string): void {
  try {
    const stored = loadStoredParameters();
    stored.applyCommand = {
      configPath,
      lastUsed: new Date().toISOString()
    };
    
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(stored, null, 2));
  } catch (error) {
    console.warn('Warning: Could not save apply parameters:', error);
  }
}

export function getLastGenerateParameters(): { outputPath?: string; ip?: string } {
  const stored = loadStoredParameters();
  return {
    outputPath: stored.generateCommand.outputPath,
    ip: stored.generateCommand.ip
  };
}

export function getLastApplyParameters(): { configPath?: string } {
  const stored = loadStoredParameters();
  return {
    configPath: stored.applyCommand.configPath
  };
}

export function hasLastGenerateParameters(): boolean {
  const params = getLastGenerateParameters();
  return !!(params.outputPath);
}

export function hasLastApplyParameters(): boolean {
  const params = getLastApplyParameters();
  return !!(params.configPath);
}