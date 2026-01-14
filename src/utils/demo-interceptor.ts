import demoConfig from '../config/demo-config.json';

export interface InterceptionResult {
  intercepted: boolean;
  feature?: string;
  message?: string;
}

export function shouldIntercept(url: string): InterceptionResult {
  if (!demoConfig.enabled) {
    return { intercepted: false };
  }

  // Check explicit intercepts from config
  for (const intercept of demoConfig.intercepts) {
    // Simple substring match or domain match
    if (url.includes(intercept.pattern)) {
      return {
        intercepted: true,
        feature: intercept.feature,
        message: intercept.message,
      };
    }
  }

  return { intercepted: false };
}
