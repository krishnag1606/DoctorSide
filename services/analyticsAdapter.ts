// Mock analytics adapter for tracking user events
export const analyticsAdapter = {
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (__DEV__) {
      console.log(`Analytics Event: ${eventName}`, properties);
    }
    // In a real app, this would send data to analytics service
  },

  trackScreenView(screenName: string, properties?: Record<string, any>) {
    this.trackEvent('screen_view', { screen: screenName, ...properties });
  },

  setUserProperties(properties: Record<string, any>) {
    if (__DEV__) {
      console.log('Analytics User Properties:', properties);
    }
  }
};