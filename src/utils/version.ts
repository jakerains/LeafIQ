// Import version from package.json
import packageJson from '../../package.json';

export interface VersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  buildDate: string;
  environment: string;
}

/**
 * Get version information from package.json
 */
export const getVersionInfo = (): VersionInfo => {
  const version = packageJson.version;
  const [major, minor, patch] = version.split('.').map(Number);
  
  return {
    version,
    major,
    minor,
    patch,
    buildDate: new Date().toISOString(),
    environment: import.meta.env.MODE || 'development'
  };
};

/**
 * Get just the version string
 */
export const getVersion = (): string => {
  return packageJson.version;
};

/**
 * Get version with environment info
 */
export const getVersionWithEnv = (): string => {
  const env = import.meta.env.MODE || 'dev';
  return `v${packageJson.version} (${env})`;
};

/**
 * Check if this is a production build
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Get build timestamp
 */
export const getBuildTimestamp = (): string => {
  // Use build-time timestamp if available, otherwise use current time
  return import.meta.env.VITE_BUILD_TIMESTAMP || new Date().toISOString();
};

/**
 * Get git branch information
 */
export const getGitBranch = (): string => {
  return import.meta.env.VITE_GIT_BRANCH || 'unknown';
};

/**
 * Get comprehensive build info
 */
export const getBuildInfo = () => {
  return {
    version: getVersion(),
    timestamp: getBuildTimestamp(),
    branch: getGitBranch(),
    environment: import.meta.env.MODE || 'development',
    isProduction: isProduction()
  };
}; 